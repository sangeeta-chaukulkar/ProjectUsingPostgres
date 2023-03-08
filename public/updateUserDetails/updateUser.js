const updatebtn = document.getElementById('update-btn');
updatebtn.addEventListener('click',updateUser);
const id= localStorage.getItem('id');

function callAutomatically(){
    axios.get(`http://localhost:3000/user/${id}`).then((result)=>{
        console.log(result)
        document.getElementById("userName").value= result.data[0].name;
        document.getElementById('email').value = result.data[0].email;
    })
}
callAutomatically()

function updateUser(e){
    e.preventDefault();
    var nameupdated = document.getElementById("userName").value;
    var emailupdated = document.getElementById('email').value
    var passwordupdated = document.getElementById('password').value;
    const id= localStorage.getItem('id');
    validate()
    axios.patch(`http://localhost:3000/updatUser/${id}`,{
         name: nameupdated,
         email: emailupdated ,
        password : passwordupdated
      })
    .then((response) => {
       alert(response.data.message)
      window.location.reload(true);
    })
    .catch((err) => {
    console.log(err)});
}
function validate() {  
    const userName = document.getElementById('userName');
    const email = document.getElementById('email');
    if (userName.value.length <= 0) {  
        alert("Name is required");  
        return false;  
    } 
    ValidateEmail(email);
}

function ValidateEmail(inputText)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.value.match(mailformat))
    {
    return true;
    }
    else
    {
    alert("You have entered an invalid email address!");
    inputText.focus();
    return false;
    }
}

