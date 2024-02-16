// let classificationList = document.querySelector("#classificationList")
// let deleteButton = document.querySelector("#deleteButton")

 // Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList")
let deleteButton = document.querySelector("#deletebutton")
console.log("I'm getting this")
classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value 
  console.log(`classification_id is: ${classification_id}`)
  deleteButton.innerHTML = `<a href="/inv/delete-class/${classification_id}">Delete</a>`
  
  
  // const link = document.createElement("a")
  
  
  // link.setAttribute("href", `/inv/delete-class/${classification_id}`)
  // deleteButton.appendChild(link)
})
