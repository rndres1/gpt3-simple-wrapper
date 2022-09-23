function button1_function() {
    let loader = document.getElementById("loader");
    let buttonText = document.getElementById("buttonText");
    let resultText = document.getElementById("changedWithJS");
    let authtext = document.getElementById("authResult");
    resultText.style.display = "none";
    loader.style.display = "inline-block";
    buttonText.style.display = "none";
    

    check_URL = window.location.origin + "/.netlify/functions/verifytoken";
    let xhr1 = new XMLHttpRequest();
    xhr1.open("POST", check_URL, true); 
    xhr1.setRequestHeader("Accept", "application/json");
    xhr1.setRequestHeader("Content-Type", "application/json");
    xhr1.onload = function () {
      authtext.innerHTML = xhr1.responseText;
      // resultText.style.display = "block";
      // loader.style.display = "none"; // this makes the spinner stop spinning
      // buttonText.style.display = "inline-block";
      if(xhr1.status===200){
        // ==========
        textgen_URL = window.location.origin + "/.netlify/functions/get_text_openai";
        let xhr = new XMLHttpRequest();
        xhr.open("POST", textgen_URL, true); 
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");  
        xhr.onload = function () {
          resultText.innerHTML = xhr.responseText;
          resultText.style.display = "block";
          loader.style.display = "none";
          buttonText.style.display = "inline-block";

          /* let submitButton = document.getElementById("submitButton");
          let input1 = document.getElementById("text1");
          submitButton.disabled = true;
          input1.disabled = true; */
          // WE ARE GOING TO ALLOW more than one query
        }
        let text1 = document.getElementById("text1").value;
        text1 = JSON.stringify(text1);
        //text1 = text1.replace("\n", " ");
        let POSTdata = `{"query": ${text1}, "authToken": "${document.getElementById("authkey").value}"}`;
        console.log(POSTdata);
        xhr.send(POSTdata);
        // ==========
      }
    }
    let POSTdata1 = `{"user_token": "${document.getElementById("authkey").value}"}`;
    console.log(POSTdata1);
    xhr1.send(POSTdata1);
}


function onInputChange() {
    let input1 = document.getElementById("text1");
    let input2 = document.getElementById("authkey");

    let submitButton = document.getElementById("submitButton");
    submitButton.disabled = input1.value.length===0 || input2.value.length===0 ;
  }