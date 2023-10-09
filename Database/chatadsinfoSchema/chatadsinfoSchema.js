const { pluralize, model, Schema } = require('mongoose')
pluralize(null);

const userinfoSchema = require('../userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const taskinfoSchema = require('../taskinfoSchema/taskinfoSchema')
const Taskinfo = model('taskinfo', taskinfoSchema);

const chatadsinfoSchema = Schema({
    user_id:{ type: Number, required: true },
    campaign_id: { type: Number, required: true, unique: true, index: true },
    title: { type: String },
    description: { type: String },
    chat_name: { type: String, required: true },
    chat_type: { type: String, required: true },
    status: { type: Boolean, required: true },
    cpc: { type: Number, required: true },
    budget: { type: Number, required: true },
    stay_time: { type: Number, required: true },
    joined: { type: Number, default: 0 },
    remain_submission: { type: Number, required: true },
    is_error: { type: Boolean, default: false },
    error_message: { type: String, default: false },
    last_update_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
})



chatadsinfoSchema.statics = {

    TotalAdCreate : async function () {
        try {
            return await this.countDocuments({})
        } catch (error) {
            return false
        }
    },

    TotalAdCreateByUserId : async function (user_id) {
        try {
            return await this.countDocuments( { user_id : user_id } )
        } catch (error) {
            return false
        }
    },

    UniqueCampaignId : async function () {
        try {
            var total_ad_create = await this.TotalAdCreate()
            var UniqueCampaignId = total_ad_create+1
            return UniqueCampaignId
        } catch (error) {
            return false
        }
    },

    InsertNewChatAd : async function (ctx,campaign_id,title,description,chat_name,chat_type,cpc,budget,stay_time,remain_submission) {
        try {
            var Chatadsinfo = model('chatadsinfo', chatadsinfoSchema)
            await new Chatadsinfo( { user_id : ctx.from.id, campaign_id : campaign_id, title : title, description : description, chat_name : chat_name, chat_type : chat_type, status : true, cpc : cpc, budget : budget, stay_time : stay_time, remain_submission : remain_submission } ).save()
            await Userinfo.UpdateTotalChatAdsCreate(ctx.from.id)
            return true
        } catch (error) {
            return false
        }    
    },

    RemoveOneAdByCampaignId : async function (campaign_id) {
        try {
            await this.deleteOne( { campaign_id : campaign_id } );
            return true
        } catch (error) {
            return false
        }
    },

    SearchByCampaingId : async function (campaign_id) {
        try {
            var data = await this.findOne( { campaign_id : campaign_id } )
            if (data) {
                return data
            }
            return false
        } catch (error) {
            return false
        }
    },

    ListOfCampaignId : async function (user_id) {
        try {
            var result = await this.find( { user_id: user_id }, { "_id" : 0, "campaign_id" : 1 } ).sort( { campaign_id : 1 } )
            if (result[0]) {
                return result
            }
            return false
        } catch (error) {
            return false
        }
    },

    ListOfChatAd : async function (user_id) {
        try {
            var result = await this.find( { user_id : user_id } ).sort( { campaign_id : 1 } )
            if (result) {
                return result
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalCreateAd : async function (user_id) {
        try {
            return await this.countDocuments( { user_id : user_id } )
        } catch (error) {
            return false
        }
    },

    DispalyRank : async function (campaign_id) {
        try {
            let value = false;
            var res = await this.find( { status : true, is_error : false, remain_submission : { $gt : 0 } }, { "_id" : 0, "campaign_id" : 1 } ).sort( { cpc : -1 } )
            await res.forEach(async function (data,index){
                if (data.campaign_id==campaign_id) {
                    value = index+1
                }
            })

            return value
        } catch (error) {
            return false
        }
    },

    ChatAdOne : async function (user_id,skip) {
        try {
            var result = await this.findOne( { user_id : user_id } ).sort( { campaign_id : 1 } ).skip(skip)
            var display_rank = await this.DispalyRank(result.campaign_id)
            result['display_rank'] = display_rank
            if (result) {
                return result
            }
            return false
        } catch (error) {
            return false
        }
    },

    FindChatAd : async function (user_id) {
        try {
            var filter = []
            var res = await Taskinfo.find( { tasker_id : user_id, $or : [ { task_type : 'channel' }, { task_type : 'group' } ] }, { "_id" : 0, "campaign_id" : 1 } )      
            res.forEach((data) => {
                filter.push(data.campaign_id)
            })
            var data = await this.findOne( { user_id : { $ne : user_id }, campaign_id : { $nin : filter }, status : true, is_error : false, remain_submission : { $gt :0 } } ).sort( { cpc : -1 } )

            if (data) {
                return data
            }
            return false
        } catch (error) {
            return false
        }
    },

    UpdateSubmission : async function (campaign_id,remain_submission,budget,joined) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $inc : { remain_submission : remain_submission, budget: budget, joined : joined }, $set : { last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    }, 

    UpdateStatus : async function (campaign_id,status) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set : { status : status, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    ChatAdStatus : async function (chat_name,status,is_error,error_message) {
        try {
            await this.updateMany( { chat_name : chat_name }, { $set: { status : status, is_error : is_error, error_message : error_message, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditTitle : async function (campaign_id,title) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set: { title: title, last_update_at: Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditDescription: async function (campaign_id,description) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set: { description : description, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditAd: async function (campaign_id,chat_name,chat_type) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set : { chat_name : chat_name, chat_type : chat_type } } )
            await this.ChatAdStatus(chat_name,true,false,``)
            return true
        } catch (error) {
            return false
        }
    }
}



module.exports = chatadsinfoSchema