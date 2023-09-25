const amountInput = document.querySelector("#amount");
const descriptionInput = document.querySelector("#description");
const categorySelect = document.querySelector("#category");
const submitButton = document.querySelector(".submit");
const form = document.querySelector(".form");

let id = 1;
const url = "https://crudcrud.com/api/0a83dd6f88a84054afa713a633f573b3";

// Function to display data already available
async function displayData() {
  var html = "";
  //datarv is an object
  const datarv = await getLocalData();
  console.log(datarv);
  //datarv.data is an array
  const arr = datarv.data;
  console.log(arr);

  if (arr === null) return;

  for (let i = 0; i < arr.length; i++) {
    html += `<div class="child ${arr[i]._id}">
            <div>${arr[i].amntvalue}</div>
            <div>${arr[i].discripvalue}</div> 
            <div>${arr[i].catvalue}</div>
            <button class="editbtn" id="${arr[i]._id}">Edit</button>
            <button class="deletebtn" id="${arr[i]._id}">Delete</button> 
        </div>`;
  }
  const display = document.querySelector(".display");
  display.innerHTML = html;
}
displayData();

// Function to fetch data from storage
async function getLocalData() {
  try {
    return await axios.get(`${url}/Expenses`);
  } catch (error) {
    console.error(error);
  }
}

// Listen for a click on the submit button
submitButton.addEventListener("click", function (e) {
  e.preventDefault();

  const amountValue = amountInput.value;
  const descriptionValue = descriptionInput.value;
  const categoryValue = categorySelect.value;

  const expenseData = {
    amntvalue: amountValue,
    discripvalue: descriptionValue,
    catvalue: categoryValue,
  };

  if (id === 1) {
    // Adding new data
    axios
      .post(`${url}/Expenses`, expenseData)
      .then((res) => {
        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  } else if (id !== 1) {
    // Editing existing data
    axios
      .put(`${url}/Expenses/${id}`, expenseData)
      .then((res) => {
        console.log(res);
        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
});

// Event delegation for editing and deleting
const parent = document.querySelector(".display");

parent.addEventListener("click", async function editDelete(e) {
  e.preventDefault();

  if (e.target.className === "deletebtn") {
    // Delete data
    axios
      .delete(`${url}/Expenses/${e.target.id}`)
      .then((response) => {
        location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  } else if (e.target.className === "editbtn") {
    // Edit data
    const datarv = await getLocalData();
    const arry = datarv.data;
    const idd = e.target.id;

    const indx = arry.findIndex((object) => object._id === idd);

    // Populate form fields with the selected data
    amountInput.value = arry[indx].amntvalue;
    descriptionInput.value = arry[indx].discripvalue;
    categorySelect.value = arry[indx].catvalue;

    // Set the current ID for editing
    id = idd;
  }
});
