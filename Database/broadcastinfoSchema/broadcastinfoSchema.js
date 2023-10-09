const { pluralize, model, Schema } = require('mongoose')
pluralize(null);

const broadcastinfoSchema = Schema({
    user_id: { type: Number, required: true },
    type: { type: String, required: true },
    message: { type: String, default: 0 },
    message_id: { type: Number, default: 0 },
    from_chat_id: { type: Number, default: 0 },
    photo_id: { type: String, default: false },
    video_id: { type: String, default: false },
    caption: { type: String, default: false },
    is_keyboard: { type: Boolean, default: false },
    disable_web_page_preview: { type: Boolean, default: true },
    parse_mode: { type: String, default: 'HTML' },
    inline_keyboard: { type: Array },
    is_process: { type: Boolean, required: true, default: false }
})


broadcastinfoSchema.statics = {
    InsertNewTextBroadcast: async function (user_id, message, is_keyboard, disable_web_page_preview, parse_mode, inline_keyboard ) {
        try {
            var Broadcastinfo = model('broadcastinfo', broadcastinfoSchema)
            await new Broadcastinfo( { user_id : user_id, type : `text`, message : message, is_keyboard : is_keyboard, disable_web_page_preview : disable_web_page_preview, parse_mode: parse_mode, inline_keyboard: inline_keyboard, is_process: true } ).save()
            return true
        } catch (error) {
            return false
        }    
    },

    InsertNewForwardBroadcast: async function (user_id, message_id, from_chat_id ) {
        try {
            var Broadcastinfo = model('broadcastinfo', broadcastinfoSchema)
            await new Broadcastinfo( { user_id : user_id, type : `forward`, message_id : message_id, from_chat_id : from_chat_id, is_process: true } ).save()
            return true
        } catch (error) {
            return false
        }    
    },

    InsertNewPhotoBroadcast: async function (user_id, photo_id, caption, is_keyboard, disable_web_page_preview, parse_mode, inline_keyboard ) {
        try {
            var Broadcastinfo = model('broadcastinfo', broadcastinfoSchema)
            await new Broadcastinfo( { user_id : user_id, type : `photo`, photo_id : photo_id, caption : caption, is_keyboard : is_keyboard, disable_web_page_preview : disable_web_page_preview, parse_mode: parse_mode, inline_keyboard: inline_keyboard, is_process: true } ).save()
            return true
        } catch (error) {
            return false
        }    
    },

    InsertNewVideoBroadcast: async function (user_id, video_id, caption, is_keyboard, disable_web_page_preview, parse_mode, inline_keyboard ) {
        try {
            var Broadcastinfo = model('broadcastinfo', broadcastinfoSchema)
            await new Broadcastinfo( { user_id : user_id, type : `video`, video_id : video_id, caption : caption, is_keyboard : is_keyboard, disable_web_page_preview : disable_web_page_preview, parse_mode: parse_mode, inline_keyboard: inline_keyboard, is_process: true } ).save()
            return true
        } catch (error) {
            return false
        }    
    },

    SearchPendingBroadcast: async function () {
        try {
            // var data = await this.find({ is_process: true })
            // if (data) {
            //     return data
            // }
            // return false

            var data = await this.findOne({ is_process: true })
            if (data) {
                return data
            }
            return false
        } catch (error) {
            return false
        }
    },

    DeletePendingBroadcast: async function (_id) {
        try {
            var data = await this.deleteOne({ _id: _id })
            if (data) {
                return true
            }
            return false
        } catch (error) {
            return false
        }
    },

    TotalPendingBroadcast: async function () {
        try {
            return await this.countDocuments({ is_process: true })
        } catch (error) {
            return false
        }
    },

    StartBroadcast: async function () {
        try {
            await this.updateMany({}, { $set: { is_process: true } })
            return true
        } catch (error) {
            return false
        }
    },

    StopBroadcast: async function () {
        try {
            await this.updateMany({}, { $set: { is_process: false } })
            return true
        } catch (error) {
            return false
        }
    }
}

module.exports = broadcastinfoSchema