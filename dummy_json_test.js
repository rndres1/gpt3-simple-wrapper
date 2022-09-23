const fs = require("fs");
const {parse, stringify, toJSON, fromJSON} = require('flatted');




/* fs.readFile("./moderation_API_response2.json", "utf8", (err, jsonString) => 
    {
    if (err) {
        console.log("File read failed:", err);
        return;
    }
        console.log("File read succesfully. Size of data: " + jsonString.length);
        
        var verdict;
        jobj = parse(jsonString);
        cat = jobj.data.results[0].categories;
        cat_bool = [];
        for(var i in cat)
            cat_bool.push(cat[i]);
        console.log(cat_bool);
        verdict = cat_bool.reduce((a, b) => a || b, false)
        
        if (!verdict)
            console.log("verdict is " + verdict + ". so, can return this text");    
        else
            console.log("blocked this text");
     
    }
); */


   /*  
        //cat_scores = jobj.data.results[0].category_scores;
        var cat_scores_float = [];
            for(var i in cat_scores)
                cat_scores_float.push(cat_scores[i]);
            console.log(cat_scores_float); */

        //console.log(jobj.data.results[0].categories);