const { pluralize, model, Schema } = require('mongoose')
pluralize(null);

const userinfoSchema = require('../userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const taskinfoSchema = require('../taskinfoSchema/taskinfoSchema')
const Taskinfo = model('taskinfo', taskinfoSchema);

const urladsinfoSchema = Schema({
    user_id:{ type: Number, required: true },
    campaign_id: { type: Number, required: true, unique: true, index: true },
    title: { type: String },
    description: { type: String },
    url_link: { type: String, required: true },
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


urladsinfoSchema.statics = {

    TotalAdCreate : async function () {
        try {
            return await this.countDocuments({})
        } catch (error) {
            return false
        }
    },

    TotalAdCreateByUserId : async function (user_id) {
        try {
            return await this.countDocuments({user_id : user_id})
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

    InsertNewUrlAd : async function (ctx,campaign_id,title,description,url_link,stay_time,cpc,budget,remain_submission) {
        try {
            var Urladsinfo = model('urladsinfo', urladsinfoSchema)
            await new Urladsinfo({ user_id : ctx.from.id, campaign_id : campaign_id, title : title, description : description, url_link : url_link, stay_time : stay_time, status : true, cpc : cpc, budget : budget, remain_submission : remain_submission }).save()
            await Userinfo.UpdateTotalUrlAdsCreate(ctx.from.id)
            return true
        } catch (error) {
            return false
        }    
    },

    RemoveOneAdByCampaignId : async function (campaign_id) { //yes
        try {
            await this.deleteOne( { campaign_id : campaign_id } );
            return true
        } catch (error) {
            return false
        }
    },

    SearchByCampaingId : async function (campaign_id) { //yes
        try {
            var result = await this.findOne( { campaign_id : campaign_id } )
            if (result) {
                return result
            }
            return false
        } catch (error) {
            return false
        }
    },

    ListOfCampaignId : async function (user_id) {
        try {
            var result = await this.find( { user_id : user_id },{ "_id" : 0, "campaign_id" : 1 } ).sort( { campaign_id : 1 } )
            return result
        } catch (error) {
            return false
        }
    },

    ListOfUrlAd : async function (user_id) {
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
            return await this.countDocuments({user_id :user_id})
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

    UrlAdOne : async function (user_id,skip) {
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

    FindUrlAd : async function (user_id) { //yes
        try {
            var filter = []
            var res = await Taskinfo.find( { tasker_id : user_id, task_type : 'url' }, { "_id" : 0, "campaign_id" : 1 } )      
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

    UpdateSubmission : async function (campaign_id,remain_submission,budget,joined) { // yes
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $inc : { remain_submission : remain_submission, budget: budget, joined : joined }, $set: { last_update_at : Date.now() } } )
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

    EditTitle : async function (campaign_id,title) {
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set : { title : title, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditDescription: async function (campaign_id,description) { //yes
        try {
            await this.findOneAndUpdate( { campaign_id : campaign_id }, { $set : { description : description, last_update_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }
    },

    EditAd: async function (campaign_id,url_link) { //yes
        try {
            await this.findOneAndUpdate( {campaign_id : campaign_id }, { $set: { url_link : url_link } } )
            return true
        } catch (error) {
            return false
        }
    }
}


module.exports = urladsinfoSchema