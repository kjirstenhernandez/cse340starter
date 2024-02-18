// let classificationList = document.querySelector("#classificationList")
// let deleteButton = document.querySelector("#deleteButton")

 // Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList")
let deleteButton = document.querySelector("#deletebutton")

classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value 
  deleteButton.innerHTML = `<a href="/inv/delete-class/${classification_id}">Delete</a>`
  

})
