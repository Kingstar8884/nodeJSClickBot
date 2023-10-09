const { pluralize, model, Schema } = require('mongoose')
pluralize(null);


const userinfoSchema = require('../userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const taskinfoSchema = require('../taskinfoSchema/taskinfoSchema')
const Taskinfo = model('taskinfo', taskinfoSchema);

const postadsinfoSchema = Schema({
    user_id:{ type: Number, required: true },
    campaign_id: { type: Number, required: true, unique: true, index: true },
    type: { type: String, required: true },
    text: { type: String, default: false },
    fromChatId: { type: Number, default: false},
    message_id: { type: Number, default: false },
    photo_id: { type: String, default: false },
    video_id: { type: String, default: false },
    caption: { type: String, default: false },
    stay_time: { type: Number, required: true },
    status: { type: Boolean, required: true },
    cpc: { type: Number, required: true },
    budget: { type: Number, required: true },
    joined: { type: Number, default: 0 },
    remain_submission: { type: Number, required: true },
    is_error: { type: Boolean, default: false },
    error_message: { type: String, default: false },
    last_update_at: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now }
})



postadsinfoSchema.statics = {

    TotalAdCreate : async function () {
        try {
            return await this.countDocuments({})
        } catch (error) {
            console.log(error)
            return false
        }
    },

    TotalAdCreateByUserId : async function (user_id) {
        try {
            return await this.countDocuments({user_id :user_id})
        } catch (error) {
            console.log(error)
            return false
        }
    },

    UniqueCampaignId : async function () {
        try {
            var total_ad_create = await this.TotalAdCreate()
            var UniqueCampaignId = total_ad_create+1
            return UniqueCampaignId
        } catch (error) {
            console.log(error)
            return false
        }
    },

    InsertNewPostAd : async function (ctx,campaign_id,type,text,fromChatId,message_id,photo_id,video_id,caption,stay_time,cpc,budget,remain_submission) {
        try {
            var Postadsinfo = model('postadsinfo', postadsinfoSchema)
            await new Postadsinfo({ user_id :ctx.from.id, campaign_id:campaign_id, type:type, text:text, fromChatId:fromChatId, message_id:message_id, photo_id:photo_id, video_id:video_id, caption:caption, stay_time: stay_time, status: true, cpc: cpc, budget: budget, remain_submission: remain_submission }).save()
            await Userinfo.UpdateTotalPostAdsCreate(ctx.from.id)
            return true
        } catch (error) {
            console.log(error)
            return false
        }    
    },

    RemoveOneAdByCampaignId : async function (campaign_id) {
        try {
            await this.deleteOne({ campaign_id: campaign_id });
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    SearchByCampaingId : async function (campaign_id) {
        try {
            var result = await this.find({campaign_id:campaign_id})
            return result[0]
        } catch (error) {
            console.log(error)
            return false
        }
    },

    ListOfCampaignId : async function (user_id) {
        try {
            var result = await this.find( { user_id: user_id },{"_id":0,"campaign_id":1}).sort({campaign_id:1})
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    },

    ListOfPostAd : async function (user_id) {
        try {
            var result = await this.find( { user_id : user_id } ).sort({campaign_id:1})
            return result
        } catch (error) {
            console.log(error)
            return false
        }
    },

    TotalCreateAd : async function (user_id) {
        try {
            var result = await this.find( { user_id : user_id } )
            return result.length
        } catch (error) {
            console.log(error)
            return 0
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

    PostAdOne : async function (user_id,skip) {
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

    FindPostAd : async function (user_id) {
        try {
            var filter = []
            var res = await Taskinfo.find( { tasker_id : user_id, task_type : 'post' }, { "_id" : 0, "campaign_id" : 1 } )      
            res.forEach((data)=>{
                filter.push(data.campaign_id)
            })
            var data = await this.findOne( { user_id : { $ne : user_id }, campaign_id : { $nin : filter }, status : true, is_error : false, remain_submission : { $gt : 0 } } ).sort( { cpc : -1 } )

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

    EditAd: async function (campaign_id,type,text,fromChatId,message_id,photo_id,video_id,caption) { //yes
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set : { type : type, text : text, fromChatId : fromChatId, message_id : message_id, photo_id : photo_id, video_id : video_id, caption : caption } } )
            return true
        } catch (error) {
            return false
        }
    }
}



module.exports = postadsinfoSchema