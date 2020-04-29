String.prototype.toLeet = function(){
	result = this
	result = result.replace(/o/gi, "0")
	result = result.replace(/i/gi, "1")
	result = result.replace(/e/gi, "3")
	result = result.replace(/a/gi, "4")
	result = result.replace(/s/gi, "5")
	result = result.replace(/t/gi, "7")
	result = result.replace(/b/gi, "8")
	return result
}