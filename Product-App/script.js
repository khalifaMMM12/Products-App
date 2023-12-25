// FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCsg9lxDcvYuBbAiho0k3P6-_C2GTkud30",
    authDomain: "product-inventory-4b5f4.firebaseapp.com",
    databaseURL: "https://product-inventory-4b5f4-default-rtdb.firebaseio.com",
    projectId: "product-inventory-4b5f4",
    storageBucket: "product-inventory-4b5f4.appspot.com",
    messagingSenderId: "474540523393",
    appId: "1:474540523393:web:878845c6cbeddf218bb280"
};            

firebase.initializeApp(firebaseConfig);
const productInventoryDB = firebase.firestore();

// SUBMIT BTN EVENT LISTENER
document.getElementById("addProductform").addEventListener("submit", function (e) {
    e.preventDefault();
    productForm(e);
});

function productForm(e) {
    e.preventDefault();
    
    let product = document.getElementById("Product").value;
    let description = document.getElementById("Description").value;
    let quantity = document.getElementById("quantity").value;
    let price = document.getElementById("Price").value; 
    // console.log(product, description, price);
    
    
    if(product !== "" && price !== ""){
        
        productInventoryDB.collection('products-Inventory')
        .add({
            product: product,
            description: description,
            quantity: quantity,
            price: price
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id)
            document.querySelector(".alert").style.display = "block";

        setTimeout(() => {
            document.querySelector(".alert").style.display = "none";
        }, 1500);

        document.querySelector('tbody').innerHTML = ""
        displayProducts()
        })
        .catch((error) => {
            console.log(error.message)
        }) 

        CalculateTotal();
    }else{
        document.querySelector(".n-alert").style.display = "block";

        setTimeout(() => {
            document.querySelector(".n-alert").style.display = "none";
        }, 1500);
    }    

}


//DISPLAY PRODUCT FUNCTION
function displayProducts() {
  productInventoryDB.collection("products-Inventory").get()
      .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              let data = doc.data();
              console.log(doc.id, " => ", data);

              const rowId = doc.id;
              let row = document.createElement('tr');
              row.id = rowId;
              row.classList.add('product-row');

              row.innerHTML = `
                  <td><input type="checkbox" class="row-checkbox" id="checkBox"></td>
                  <td scope="col" class="col-3">${data.product}</td>
                  <td scope="col" class="col-5">${data.description}</td>
                  <td scope="col" class="col-2">${data.quantity}</td>
                  <td scope="col" class="col-6">${data.price}</td>
                  <td><button class="btn" onClick="editProduct('${rowId}')"><i class="bi bi-pencil-square"></i></button></td>
              `;

              // Event listener to toggle checkbox and apply selected style
              row.addEventListener("click", function (event) {
                  // Check if the click is on the edit button to prevent toggling the checkbox
                  if (!event.target.closest('.btn')) {
                      let checkbox = row.querySelector(".row-checkbox");
                      checkbox.checked = !checkbox.checked;
                      row.classList.toggle('selected-row');
                  }
              });

              document.querySelector('tbody').appendChild(row);
          });

          CalculateTotal();
      });
}

displayProducts();



// Edit product function
function editProduct(rowId) {
  let productRow = document.getElementById(rowId);
  let productName = productRow.querySelector('td:nth-child(2)').textContent;
  let productDescription = productRow.querySelector('td:nth-child(3)').textContent;
  let productQuantity = productRow.querySelector('td:nth-child(4)').textContent;
  let productPrice = productRow.querySelector('td:nth-child(5)').textContent;

 
  document.getElementById('editProduct').value = productName;
  document.getElementById('editDescription').value = productDescription;
  document.getElementById('editQuantity').value = productQuantity;
  document.getElementById('editPrice').value = productPrice;

  // Store the product ID in a global variable
  window.editingProductID = rowId;

  // Show the Edit Modal
  $('#EditProduct').modal('show');
  console.log("product edit");
}

document.getElementById('editProductForm').addEventListener('submit', function (e) {
  e.preventDefault();

  
  let editedProductName = document.getElementById('editProduct').value;
  let editedProductDescription = document.getElementById('editDescription').value;
  let editedProductQuantity = document.getElementById('editQuantity').value;
  let editedProductPrice = document.getElementById('editPrice').value;

  // Retrieve the stored product ID
  let productID = window.editingProductID;

  if (productID) {
    let productRef = productInventoryDB.collection('products-Inventory').doc(productID);

    productRef.update({
      product: editedProductName,
      description: editedProductDescription,
      quantity: parseInt(editedProductQuantity),
      price: parseFloat(editedProductPrice)
    })
      .then(() => {
        console.log('Product updated successfully in Firestore');

        $('#EditProduct').modal('hide');

        document.querySelector('tbody').innerHTML = "";
        displayProducts();
        CalculateTotal();
      })
      .catch((error) => {
        console.error('Error updating product in Firestore: ', error);
      });
    } else {
      console.error('Product ID not available for update');
    }
  
  $('#EditProduct').modal('hide');
});


 // Getting the total price
 function CalculateTotal() {
  let total = 0;
  let priceCells = document.querySelectorAll("#ProductTable tbody td:nth-child(5)");
  let quantityCells = document.querySelectorAll("#ProductTable tbody td:nth-child(4)");

  for (let i = 0; i < priceCells.length; i++) {
      let price = parseFloat(priceCells[i].textContent.replace(/[^0-9.]/g, ''));
      let quantity = parseInt(quantityCells[i].textContent);

      if (!isNaN(price) && quantity > 0) {
          total += price * quantity;
      }
  }

  let formattedTotal = total.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  document.getElementById("TotalPrice").textContent = "Total Price: " + formattedTotal;
}



let sellButton = document.getElementById("sellBtn");
sellButton.addEventListener("click", async function () {
  // Array to store selected row data
  let selectedRows = [];

  let checkBoxes = document.querySelectorAll("#ProductTable tbody input[type=checkbox]");

  for (let index = 0; index < checkBoxes.length; index++) {
    let checkbox = checkBoxes[index];
    if (checkbox.checked) {
      let productRow = document.querySelectorAll("#ProductTable tbody tr")[index];

      if (productRow) {
        let productID = productRow.getAttribute('id');
        let product = productRow.querySelector('td:nth-child(2)').textContent;
        let description = productRow.querySelector('td:nth-child(3)').textContent;
        let quantity = parseInt(productRow.querySelector('td:nth-child(4)').textContent);
        let price = productRow.querySelector('td:nth-child(5)').textContent;

        // Update the quantity in Firestore
        if (quantity > 0) {
          quantity--;

          // Update the quantity in Firestore
          await productInventoryDB.collection("products-Inventory").doc(productID).update({
            quantity: quantity
          });

          // Add the product to selectedRows array
          let existingProduct = selectedRows.find((row) => row.productID === productID);

          if (existingProduct) {
            // If the product exists in selectedRows, update its quantity
            existingProduct.quantity++;
          } else {
            // If the product doesn't exist in selectedRows, add a new entry
            selectedRows.push({
              productID: productID,
              product: product,
              description: description,
              quantity: 1,
              price: price,
            });
          }
          // Update Zero Quantity
          if (quantity > 0) {
            productRow.querySelector('td:nth-child(4)').textContent = quantity;
          }
        }else{
          selectedRows.push(product);
        }
      }
    }
  }
      if (selectedRows.length > 0){
        let message = "The Following Product Is Unavailable: " + selectedRows.join(' ,  ');
        alert (message);
      }else{
        let Smessage = "Product uploaded successfully: " + selectedRows.join(' ,  ')
        alert(Smessage)
      }

  // Remove products with zero quantity from the products-Inventory collection
  let deletePromises = selectedRows
    .filter((row) => row.quantity === 0)
    .map((row) => productInventoryDB.collection("products-Inventory").doc(row.productID).delete());

  await Promise.all(deletePromises);

  // Add products to the sold-products collection
  for (let i = 0; i < selectedRows.length; i++) {
    let row = selectedRows[i];
    let soldProductRef = await productInventoryDB.collection("sold-products").where("productID", "==", row.productID).get();

    if (!soldProductRef.empty) {
      // If the product exists in sold-products, update its quantity
      let soldProduct = soldProductRef.docs[0].data();
      let soldProductID = soldProductRef.docs[0].id;

      await productInventoryDB.collection("sold-products").doc(soldProductID).update({
        quantity: soldProduct.quantity + row.quantity
      });
    } else {
      // If the product doesn't exist in sold-products, add a new entry
      await productInventoryDB.collection("sold-products").add({
        productID: row.productID,
        product: row.product,
        description: row.description,
        quantity: row.quantity,
        price: row.price
      });
    }
  }

  // Refresh the displayed products and total price
  document.querySelector('tbody').innerHTML = "";
  displayProducts();
  CalculateTotal();

});



 //SELECT AND DELETE BUTTON
document.addEventListener("DOMContentLoaded", function() {
    let rows = document.querySelectorAll("#ProductTable tbody tr");
    
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
                let productID = document.querySelectorAll("#ProductTable tbody tr")[index].getAttribute('id'); 
               
                productInventoryDB.collection("products-Inventory").doc(productID).delete()
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
        displayProducts()
        CalculateTotal();
    });
    // let productID = document.querySelectorAll("#ProductTable tbody tr")[index].getAttribute('id');
});


// To increament and decrement quantity val
var quantityField = document.getElementById("quantity");
const plusButton = document.querySelector(".quantity-right-plus");
const minusButton = document.querySelector(".quantity-left-minus");

plusButton.addEventListener("click", function () {
    incrementValue();
});

minusButton.addEventListener("click", function () {
    decrementValue();
});

function incrementValue() {
    var currentValue = parseInt(quantityField.value, 10) || 0;
    var maxValue = parseInt(quantityField.getAttribute("max"), 10) || Infinity;

    if (currentValue < maxValue) {
        currentValue++;
        quantityField.value = currentValue;
    }
}

function decrementValue() {
    var currentValue = parseInt(quantityField.value, 10) || 0;
    var minValue = parseInt(quantityField.getAttribute("min"), 10) || 0;

    if (currentValue > minValue) {
        currentValue--;
        quantityField.value = currentValue;
    }
}

// LOGOUT Function

function logout() {
  firebase.auth().signOut().then(() => {
      console.log('User signed out');
      window.location.href = 'index.html'
  }).catch((error) => {
      console.error('Logout error:', error);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById('Logout');
  if (logoutButton) {
      logoutButton.addEventListener('click', logout);
  }
});