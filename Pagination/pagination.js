const pagination = async (page,count,callback_data) => {
    var keyboard;
    var addcount = count+1
    var removecount = count-1

    if(page == 1){
        keyboard = false
    }

    else if(page == 2 && count == 1){
        keyboard = [{text: 'Next ⏩', callback_data: `${callback_data}_${addcount}`}]
    }

    else if(page == 2 && count == page){
        keyboard = [{text: '⏪ Back', callback_data: `${callback_data}_${removecount}`}]
    }

    else if(page > 2 && count == 1){
        keyboard = [{text: 'Next ⏩', callback_data: `${callback_data}_${addcount}`}]
    }

    else if(page > 2 && count == page){
        keyboard = [{text: '⏪ Back', callback_data: `${callback_data}_${removecount}`}]
    }

    else if(page > 2 && count < page){
        keyboard = [{text: '⏪ Back', callback_data: `${callback_data}_${removecount}`},{text: 'Next ⏩', callback_data: `${callback_data}_${addcount}`}]
    }

    return keyboard
}



const generateKeyboard = async (count,campaign_id,page,Ad_Name,StatusText,StatusCheck) => {

    var keyboard;
    var paginate = await pagination(page,count,Ad_Name);
    var Text = (Ad_Name=='ChatAd') ? 'CHAT': (Ad_Name=='BotAd') ? 'URL': (Ad_Name=='UrlAd') ? 'URL': 'POST';
    var symbol = (Ad_Name=='ChatAd') ? '📣': (Ad_Name=='BotAd') ? '🔗': (Ad_Name=='UrlAd') ? '🔗': '📄';

    if (Text=='POST') {
        
        if (!paginate) {
            keyboard = [[{text:`${symbol} Edit ${Text}`, callback_data:`Edit_Ad_${Ad_Name}_${campaign_id}`},{text:`⌛️ Edit Submission`, callback_data:`Edit_Submission_${Ad_Name}_${campaign_id}`}],[{text:`${StatusText}`,callback_data:`${StatusCheck}_${Ad_Name}_${campaign_id}_${count}`},{text:'🗑 Delete',callback_data:`Delete_${Ad_Name}_${campaign_id}_${count}`}]]        
        }else{
            keyboard = [[{text:`${symbol} Edit ${Text}`, callback_data:`Edit_Ad_${Ad_Name}_${campaign_id}`},{text:`⌛️ Edit Submission`, callback_data:`Edit_Submission_${Ad_Name}_${campaign_id}`}],[{text:`${StatusText}`,callback_data:`${StatusCheck}_${Ad_Name}_${campaign_id}_${count}`},{text:'🗑 Delete',callback_data:`Delete_${Ad_Name}_${campaign_id}_${count}`}],paginate]
        }

        return keyboard
    }

    if (!paginate) {
        keyboard = [[{text:'📝 Edit Title',callback_data:`Edit_Title_${Ad_Name}_${campaign_id}`},{text:'💬 Edit Description',callback_data:`Edit_Description_${Ad_Name}_${campaign_id}`}],[{text:`${symbol} Edit ${Text}`, callback_data:`Edit_Ad_${Ad_Name}_${campaign_id}`},{text:`⌛️ Edit Submission`, callback_data:`Edit_Submission_${Ad_Name}_${campaign_id}`}],[{text:`${StatusText}`,callback_data:`${StatusCheck}_${Ad_Name}_${campaign_id}_${count}`},{text:'🗑 Delete',callback_data:`Delete_${Ad_Name}_${campaign_id}_${count}`}]]        
    }else{
        keyboard = [[{text:'📝 Edit Title',callback_data:`Edit_Title_${Ad_Name}_${campaign_id}`},{text:'💬 Edit Description',callback_data:`Edit_Description_${Ad_Name}_${campaign_id}`}],[{text:`${symbol} Edit ${Text}`, callback_data:`Edit_Ad_${Ad_Name}_${campaign_id}`},{text:`⌛️ Edit Submission`, callback_data:`Edit_Submission_${Ad_Name}_${campaign_id}`}],[{text:`${StatusText}`,callback_data:`${StatusCheck}_${Ad_Name}_${campaign_id}_${count}`},{text:'🗑 Delete',callback_data:`Delete_${Ad_Name}_${campaign_id}_${count}`}],paginate]
    }

    return keyboard
}


module.exports = { pagination, generateKeyboard }