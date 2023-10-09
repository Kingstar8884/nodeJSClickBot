const { pluralize, model, Schema } = require('mongoose')
pluralize(null);

const userinfoSchema = require('../userinfoSchema/userinfoSchema')
const Userinfo = model('userinfo', userinfoSchema);

const taskinfoSchema = Schema({
    tasker_id: { type: Number, required: true },
    campaign_id: { type: Number, required: true },
    task_type: { type: String, required: true },
    task_data: { type: String, default:false },
    status: { type: String, required: true },
    rewarded: { type: Number, required: true },
    advertiser_id: { type: Number, required: true },
    completed_at: { type: Date, default: Date.now }
})


taskinfoSchema.statics = {
    CompleteTask : async function (tasker_id,campaign_id,task_type,task_data,rewarded,advertiser_id) {
        try {
            var Taskinfo = model('taskinfo', taskinfoSchema)
            await new Taskinfo( { tasker_id : tasker_id, campaign_id : campaign_id, task_type : task_type, task_data : task_data, status : 'COMPLETE', rewarded : rewarded, advertiser_id : advertiser_id }).save()
            if (task_type=='channel' || task_type=='group') {
                await Userinfo.UpdateTotalChatCompletetask(tasker_id)
                return true
            }
            if (task_type=='bot') {
                await Userinfo.UpdateTotalBotCompletetask(tasker_id)  
                return true 
            }
            if (task_type=='post') {
                await Userinfo.UpdateTotalPostCompletetask(tasker_id) 
                return true 
            }
            if (task_type=='url') {
                await Userinfo.UpdateTotalUrlCompletetask(tasker_id)
                return true
            }
            return false
        } catch (error) {
            return false
        }    
    },

    PendingTask : async function (tasker_id,campaign_id,task_type,task_data,rewarded,advertiser_id,completed_at) {
        try {
            var Taskinfo = model('taskinfo', taskinfoSchema)
            await new Taskinfo( { tasker_id : tasker_id, campaign_id : campaign_id, task_type : task_type, task_data : task_data, status : 'PENDING', rewarded : rewarded, advertiser_id : advertiser_id, completed_at : completed_at } ).save()
            return true
        } catch (error) {
            return false
        }    
    },

    SkipTask : async function (tasker_id,campaign_id,task_type,task_data,rewarded,advertiser_id) {
        try {
            var Taskinfo = model('taskinfo', taskinfoSchema)
            await new Taskinfo( { tasker_id : tasker_id, campaign_id : campaign_id, task_type : task_type, task_data : task_data, status : 'SKIP', rewarded : rewarded, advertiser_id : advertiser_id } ).save()
            return true
        } catch (error) {
            return false
        }    
    },

    DeleteTask : async function (_id) {
        try {
            await this.deleteOne( { _id : _id } )
            return true
        } catch (error) {
            return false
        }    
    },

    UpdateTask : async function (_id) {
        try {
            await this.findOneAndUpdate( { _id : _id }, { $set : { status : 'COMPLETE', completed_at : Date.now() } } )
            return true
        } catch (error) {
            return false
        }    
    },

    SearchChatPendingTask : async function (completed_at) {
        try {
            var result = await this.findOne( { completed_at : { $lt : completed_at}, status : 'PENDING', $or : [ { task_type : 'channel' }, { task_type : 'group'} ] } )
            if (result) {
                return result
            }
            return false
        } catch (error) {
            return false
        }
    } 
}



module.exports = taskinfoSchema