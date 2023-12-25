const firebaseConfig = {
  apiKey: "AIzaSyCqPUgzZd2oubl9ZlSOtPbVOPpRU1U1r5E",
  authDomain: "products-app-cf562.firebaseapp.com",
  projectId: "products-app-cf562",
  storageBucket: "products-app-cf562.appspot.com",
  messagingSenderId: "883666757109",
  appId: "1:883666757109:web:0865ebe2c1179ff3cfacbc"
};            

firebase.initializeApp(firebaseConfig);
const productInventoryDB = firebase.firestore();


  
  document.addEventListener("DOMContentLoaded", function () {
    soldProducts();
  });
  
  async function soldProducts() {
    const querySnapshot = await productInventoryDB.collection("sold-products").get();
  
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      console.log(doc.id, " => ", doc.data());
  
      let soldQuantity = data.quantity; // Get the quantity from the sold-products collection
  
      document.querySelector("#bodytable").innerHTML +=
    ` <tr id=${doc.id} class="product-row">
        <td><input type="checkbox" id="checkBox"></td>
        <td scope="col" class="col-3">${data.product}</td>
        <td scope="col" class="col-5">${data.description}</td>
        <td scope="col" class="col-2">${soldQuantity}</td>
        <td scope="col" class="col-6">${data.price}</td>
      </tr>`;

      // Event listener to toggle checkbox and apply selected style
    //   row.addEventListener("click", function(event){

    //     if(!event.target.closest('.btn')) {
    //       let checkbox = row.querySelector(".row-checked");
    //     checkbox.checked = !checkbox-checked;
    //     row.Classlist.toggle('selected-row');      }
    //   })
    });
  
    CalculateTotal();
  }
  

    // Getting the total price
function CalculateTotal() {
  var total = 0;
  var priceCells = document.querySelectorAll("#soldTable tbody td:nth-child(5)");
  var quantityCells = document.querySelectorAll("#soldTable tbody td:nth-child(4)")

  priceCells.forEach(function(priceCell, index) {
      var price = parseFloat(priceCell.textContent.replace(/[^0-9.]/g, ''));
      var quantity = parseInt(quantityCells[index].textContent)

      if (!isNaN(price) && !isNaN(quantity)) {
          total += price * quantity;
      }
    
  });

  var formattedTotal = total.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  document.getElementById("TotalPrice").textContent = "Total Price: " + formattedTotal;
}
window.onload = CalculateTotal;


document.addEventListener("DOMContentLoaded", function() {
  let rows = document.querySelectorAll("#soldTable tbody tr");
  
  rows.forEach(function(row){
      let checkbox = row.querySelector("#checkBox");
      
      row.addEventListener("click", function() {
          checkbox.checked = !checkbox.checked;
      }); 
  });

  let deleteButton = document.getElementById("deleteBtn");
  deleteButton.addEventListener("click", function() {
      let checkBoxes = document.querySelectorAll("#checkBox");
      
      // an array to store checked checkboxes
      let checkedCheckboxes = [];
      
      checkBoxes.forEach(function(checkbox, index) {
          if (checkbox.checked) {
              let productID = document.querySelectorAll("#soldTable tbody tr")[index].getAttribute('id'); 
             
              productInventoryDB.collection("sold-products").doc(productID).delete()
              .then(() => {
                  console.log("Document deleted succesfully");
              }).catch((error) => {
                  console.error("Error removing document: ", error);
              });
             
          }

      });

      // removing the checked checkboxes from the DOM
      checkedCheckboxes.forEach(function(checkbox) {
          checkbox.parentElement.parentElement.remove();
      });

      document.querySelector('tbody').innerHTML = ""
      soldProducts()
      CalculateTotal();
    });

});

  