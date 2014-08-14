/* Demandbase Plugin Start - 9/20/2012 */
window.wasErrorInDemandbasePlugin = false;
window.gmtInThirtyMinutes = (function () {var d = new Date(); d.setTime(d.getTime() + 18E5); return d.toGMTString();}());
window.dbData = {}; //global demandbase data
var demandbasePlugin = {
	rCookie: function(cn) {
		return (function(n){return(v=new RegExp('^'+n+'=.*|;\\s*'+n+'=.*').exec(document.cookie))?v[0].split(n+'=')[1].split(';')[0]:''})(cn);
	},
	wCookie: function(cname,cvalue,expire) {
		document.cookie = (cname+'='+cvalue+'; domain = .symantec.com; path=/'+(expire)?';expires='+expire.toGMTString():'');
	},
	dataIsStored: function() {
		var dbTracked=(function(n){return(v=new RegExp('^'+n+'=.*|;\\s*'+n+'=.*').exec(document.cookie))?v[0].split(n+'=')[1].split(';')[0]:''})('dbtracked');
		if (dbTracked) {
			return true; //yes:if cookie exists then it hasn't expired
		} else {
			return false; //no:missing cookie data
		}
	//	}
	},
	checkAndReturnSameOrErrorValue: function(variableToCheck, isDetailed, errorValue, detailedErrorValue) {
		errorValue = (this.isDefinedAndNotEmpty(errorValue)) ? errorValue : "ISP Visitor";
		detailedErrorValue = (this.isDefinedAndNotEmpty(detailedErrorValue)) ? detailedErrorValue : "Error";
		if (this.isDefinedAndNotEmpty(variableToCheck)) {
			return variableToCheck;
		} else {
			if (isDetailed) {
				return detailedErrorValue;
			} else {
				return errorValue;
			}
		}
	},
	isDefinedAndNotEmpty: function(variableToCheck) {
		if ((typeof(variableToCheck) !== 'undefined') && variableToCheck !== '' && variableToCheck !== null) {
			return true;
		}
		return false;
	},
	demandbase_parse: function(dbInfo) {
		try {
			var isExternalIP = true,
				isDetailed = (dbInfo.information_level === 'Detailed')?'true':'false',
                isExternalIP = true,
				local = 'Internal Testing'; //message set for internal traffic;

			if (dbInfo.error && dbInfo.status) {
				if (dbInfo.error === 'Not Found' && dbInfo.status === '404') {
					isExternalIP = false;
				}
			}
			if (isExternalIP) {
				dbData = this.checkAndReturnSameOrErrorValue(dbInfo, isDetailed);
				var mboxdata = {};
				mboxdata.audienceSegment = dbData.audience_segment;
				mboxdata.companyName = dbData.company_name;
				mboxdata.primaryIndustry = dbData.industry;
				mboxdata.subIndustry = dbData.sub_industry;
				mboxdata.employeeCount = dbData.employee_count;
				mboxdata.demandbaseID = dbData.demandbase_sid;
				mboxdata.dmaCode = dbData.registry_dma_code;
				mboxdata.ip = dbData.ip;
				mboxdata.primarySic = dbData.primary_sic;
			
				// dbData.companyName = this.checkAndReturnSameOrErrorValue(dbInfo.company_name, isDetailed);
				// dbData.employeeCount = this.checkAndReturnSameOrErrorValue(dbInfo.employee_count, isDetailed);
				// dbData.accountStatus = this.checkAndReturnSameOrErrorValue(dbInfo.account_status, isDetailed);
				// dbData.primaryIndustry = this.checkAndReturnSameOrErrorValue(dbInfo.industry, isDetailed);
				// dbData.subIndustry = this.checkAndReturnSameOrErrorValue(dbInfo.sub_industry, isDetailed);
				// dbData.employeeBand = this.checkAndReturnSameOrErrorValue(dbInfo.employee_range, isDetailed);
				// dbData.revenueBand = this.checkAndReturnSameOrErrorValue(dbInfo.revenue_range, isDetailed);
				// dbData.state = this.checkAndReturnSameOrErrorValue(dbInfo.state, isDetailed);
				// dbData.countryName = this.checkAndReturnSameOrErrorValue(dbInfo.country_name, isDetailed);
				// dbData.fortune1000 = this.checkAndReturnSameOrErrorValue(dbInfo.fortune_1000, isDetailed);
				// dbData.website = this.checkAndReturnSameOrErrorValue(dbInfo.web_site, isDetailed);
				// dbData.demandbaseID = this.checkAndReturnSameOrErrorValue(dbInfo.demandbase_sid, isDetailed);
				 //dbData.audience = this.checkAndReturnSameOrErrorValue(dbInfo.audience, isDetailed);
				 //dbData.audienceSegment = this.checkAndReturnSameOrErrorValue(dbInfo.audience_segment, isDetailed);
				 dbData.audiencePlusSegment = dbData.audience;
				
				/**APPEND to MBOXPARAMS	
			    jQuery.data( document.body, "Sasi", "Sasi="+dbData.primaryIndustry );**/
			    
			    jQuery.data( document.body, "appendMboxParams", mboxdata );
				//console.log(jQuery.data( document.body, "appendMboxParams"));
				if(dbData.audience_segment !== "" && dbData.audience_segment !== "Error" && dbData.audience_segment !== "ISP Visitor"){
					dbData.audiencePlusSegment += " > " + dbData.audience_segment;
				}

			} else if (!isExternalIp) {
				dbData.companyName = local;
				dbData.employeeCount = local;
				dbData.accountStatus = local;
				dbData.primaryIndustry = local;
				dbData.subIndustry = local;
				dbData.employeeBand = local;
				dbData.revenueBand = local;
				dbData.state = local;
				dbData.countryName = local;
				dbData.fortune1000 = local;
				dbData.website = local;
				dbData.demandbaseID = local;
				dbData.audience = local;
				dbData.audienceSegment = local;
			}
			
			trackDemandBase();
		} catch (err) {
//			alert("error");
			wasErrorInDemandbasePlugin = true;
			
		}	
		
	}
};

var trackDemandBase = function(){ //Sam's
		var dbTracked=(function(n){return(v=new RegExp('^'+n+'=.*|;\\s*'+n+'=.*').exec(document.cookie))?v[0].split(n+'=')[1].split(';')[0]:''})('dbtracked');
		if(dbTracked.indexOf('db')==-1){
			try{
				s.linkTrackVars = 'prop28,prop51,prop55,prop63,prop38,eVar15';
				s.prop28 = dbData.companyName;
				var apsValue = dbData.audiencePlusSegment;
				if(apsValue === undefined || apsValue === null || apsValue === ""){
					apsValue = "not set";
				}
				s.prop51 = apsValue;//use error value 'not set' if server hasn't returned in time
				s.eVar15 = dbData.employee_count;
				s.prop55 = dbData.industry;
				s.prop63 = dbData.sub_industry;
				s.prop38 = dbData.ip+','+dbData.demandbase_sid+','+dbData.registry_dma_code+','+dbData.primary_sic;
				void(s.tl(this,'o','DB2SC'));
				
				s.prop28 = "";
				s.prop51 = "";
				s.eVar15 = "";
				s.prop55 = "";
				s.prop63 = "";
				s.prop38 = "";
				
				document.cookie = ('dbtracked=|db ;domain = .symantec.com; path=/; expires='+gmtInThirtyMinutes);
				return true;
			}
			catch (ex){
			}
		}
	else{
		return false;
	}
}

fireDemandBaseTracking = function(){
	var myUrl = document.domain;
	var tempUrl = myUrl.toLocaleLowerCase();
	var validUrl = tempUrl.indexOf("symantec.com") > -1 ? true : false;
	if(typeof(metaData['page_name'])!= "undefined"){
		var myPageName = metaData['page_name'];
	// if we're not en/us and not specifically on symantec.com, we're done
		if(myPageName.indexOf('en/us')<0){
			return false;
		}
		else{	// we are en/us. Test return true if any conditions are met
			
				if(myPageName == 'en/us: biz: products: products spotlight: overview'){ // For Demandbase test- Product-Solutions Overview Page
				return true;
			}
			// if(myPageName == "en/us: biz: home page: symantec"){ // homepage
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: products:')>-1){ //product pages
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: solutions:')>-1){ //solutions pages
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: themes:')>-1){ //theme pages
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: cmp:')>-1){ //campaign pages
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: resources:')>-1){ // resources
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: services:')>-1){ //services
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: smb:')>-1){ //smb
			// 	return true;
			// }
			// if(myPageName.indexOf('en/us: biz: campaign:')>-1){ //Campaigns
			// 	return true;
			// }
		}
	}
	else{
		return false;
	}
}

if ( !demandbasePlugin.dataIsStored() && fireDemandBaseTracking()){
	/* Demandbase API Call */
	var scr = document.createElement('script');
	scr.src = "https://api.demandbase.com/api/v2/ip.json?key=09884c914277626561f7b4e7cff7fa13edf3b423&query=&var=dbInfo&callback=demandbasePlugin.demandbase_parse";
	document.getElementsByTagName('head')[0].appendChild(scr);
}