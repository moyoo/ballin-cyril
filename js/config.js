/*var options =
{	
	"isApplied" : false,
	"currentparkinglot" :
	{
		"oid" : null,
		"parking_nm" : null,
		"vehicles" : 0,
		"capacity" : 0
	},
	"editinfo" : 
	{
		"featurelayerurl" : "http://icloud.incheon.go.kr/arcgis/rest/services/%EC%95%84%EC%8B%9C%EC%95%88%EA%B2%8C%EC%9E%84/%EC%95%84%EC%8B%9C%EC%95%88%EA%B2%8C%EC%9E%84_%EC%9E%84%EC%8B%9C%EC%A3%BC%EC%B0%A8%EC%9E%A5/FeatureServer/0",
		"editfields" :
		{
			"oidfield" : "OBJECTID_1",
			"namefield" : "연번",
			"vehiclefield" : "주차대",
			"capacityfield" : "capcity"
		}
	}
};
*/
var options = {
    "isApplied": false,
    "currentparkinglot": {
        "oid": null,
        "parking_nm": null,
        "vehicles": 0,
        "capacity": 0
    },
    "editinfo": {
        "featurelayerurl": "http://icloud.incheon.go.kr/arcgis/rest/services/%EC%95%84%EC%8B%9C%EC%95%88%EA%B2%8C%EC%9E%84/%EC%9E%84%EC%8B%9C%EC%A3%BC%EC%B0%A8%EC%9E%A5_%EC%85%94%ED%8B%80%EB%B2%84%EC%8A%A4%EC%8A%B9%ED%95%98%EC%B0%A8%EC%9E%A5/FeatureServer/2",
        "editfields": {
            "oidfield": "OBJECTID",
            "namefield": "주차장명",
            "vehiclefield": "현주차",
            "capacityfield": "총주차"
        }
    }
};