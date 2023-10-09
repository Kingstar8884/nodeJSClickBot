const ExploreRank = async (num) => {
    var result = (num==1) ? `1st`: (num==2) ? `2nd` : (num==3) ? `3rd` : `${num}th`
    return result
}

const Escape = (text) => {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

const HtmlParser = async (ctx,message) => {
	try {
	   await ctx.telegram.sendMessage(`@adclickersbotupdate`,message,{parse_mode:'HTML'}) 
	   return message 
	} catch (error) {
	   return false
	}
 }

module.exports = { ExploreRank, Escape, HtmlParser }