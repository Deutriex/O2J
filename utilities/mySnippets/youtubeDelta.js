function youtubeNew(chname, chvalue, phaddr, filterStr){
	buildStr = chvalue
	if (filterStr != undefined){
		buildStr += "|" + escape(filterStr)
	}
	Console.getAirisuResponseCallback("http://127.0.0.1:2006/Specialisterne/curl/ytch.php", chname, buildStr, function(){youtubeDelta(phaddr)})
}

String.prototype.YTDtoNumber = function(){
	retX = this.split(":")
	retX = retX.map(Number)
	return retX[0]*60 + retX[1]
}

String.prototype.YTDtoCaptalizeFirstLetter = function(){
	firstLetter = this.substring(0, 1).toUpperCase()
	anotherOnes = this.substring(1, this.length).toLowerCase()
	return firstLetter + anotherOnes
}

Array.prototype.YTDtoUniqueValues = function(){
	var ht = {}
	var ret = []
	var i
	for (i = 0; i < this.length; i++){
		ht[this[i]] = new String(typeof(this[i])).YTDtoCaptalizeFirstLetter()
	}

	for (retElem in ht){
		if (ht.hasOwnProperty(retElem)){
			retElemX = retElem
			if (ht[retElem] == "String"){
				retElemX = "\"" + escape(retElemX) + "\""
			}

			evalType = "new " + ht[retElem] + "(" + retElemX + ")"
			evalType = eval(evalType)
			if (ht[retElem] == "String"){
				evalType = unescape(evalType)
			}

			ret.push(evalType)
		}
	}

	return ret
}

Array.prototype.YTDgetDiff = function(anotherArray){
	var res = []
	var eachElem
	for (eachElem in this){
		if (this.hasOwnProperty(eachElem)){
			if (anotherArray.indexOf(this[eachElem]) == -1){
				res.push(this[eachElem])
			}
			
			if (this.indexOf(anotherArray[eachElem]) == -1){
				res.push(anotherArray[eachElem])
			}

		}
	}

	return res
}

Array.prototype.YTDgetLength = function(){
	var eachElem
	var res = 0
	for (eachElem in this){
		if (this.hasOwnProperty(eachElem)){
			if (typeof(this[eachElem]) != "string" || this[eachElem].trim() != ""){
				res++
			}
		}
	}

	return res	
}


String.prototype.YTDmatchHeuristics = function(anotherOne, th){
	var comp1 = this.toLowerCase().split(" ").sort().YTDtoUniqueValues()
	var comp2 = anotherOne.toLowerCase().split(" ").sort().YTDtoUniqueValues()
	var comp3 = comp1.slice().concat(comp2).sort().YTDtoUniqueValues()
	var compD = comp3.YTDgetDiff(comp2) //.YTDtoUniqueValues()
	var score = (comp3.length - compD.YTDgetLength())/comp3.length

	if (score >= th) {
		return true
	}

	return false
}

Array.prototype.YTDmatchHeuristics = function(strTitle, dur){
	var i
	for (i = 0; i < this.length; i++){
		getX = this[i].split("*")
		getTest1 = getX[0].YTDmatchHeuristics(strTitle, 0.8)
		getTest2 = (Math.abs(getX[1].YTDtoNumber()-dur) <= 1)

		if (getTest1 && getTest2){
			return true
		}
	}

	return false
}

function youtubeDelta(phaddr){
	var parseBaseName = function(strx){
		getFile = new videofile(strx)
		return strx.substring(strx.lastIndexOf("\\")+1, strx.lastIndexOf(".")) + "*" + getFile.getLength()
	}


	var teste = new folder(phaddr)
	var resultX = teste.fileList()
	resultX = resultX.map(parseBaseName)


	//resultX.sort()

	var resultY = Console.getLastData()

	resultY = resultY.split("*")
	//resultY.sort()

	var resultZ = []
	var eachElem

	for (eachElem in resultY){
		if (resultY.hasOwnProperty(eachElem)){
			resultY0 = resultY[eachElem].substring(0, resultY[eachElem].indexOf("|"))
			resultY1 = resultY[eachElem].substring(resultY[eachElem].indexOf("|")+1, resultY[eachElem].lastIndexOf("|"))
			resultY2 = resultY[eachElem].substring(resultY[eachElem].lastIndexOf("|")+1, resultY[eachElem].length)
			
			if (resultX.YTDmatchHeuristics(resultY1.replace(/[\\\/*:|"<>\?]/g, "_"), resultY2.YTDtoNumber()) == -1){
				resultZ.push(resultY0)
			}
		}
	}


	var strOut = resultZ.length + " de " + resultY.length + ":\n\n" + resultZ.join("\n")
	Console.output(strOut)
}