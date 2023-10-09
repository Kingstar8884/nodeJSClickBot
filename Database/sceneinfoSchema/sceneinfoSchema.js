const { pluralize, model, Schema } = require('mongoose')
pluralize(null);


const sceneinfoSchema = Schema({
    scene_id:{ type: Number, required: true }
})


sceneinfoSchema.statics = {

    UniqueId : async function () {
        try {
            var data = await this.findOneAndUpdate({}, { $inc: { scene_id :1 } }, { new: true })

            if (data==null) {
                var Sceneinfo = model('sceneinfo', sceneinfoSchema)
                await new Sceneinfo( { scene_id : 1 } ).save()
                return 1
            }

            return data.scene_id
        } catch (error) {
            return false
        }
    }
}


module.exports = sceneinfoSchema