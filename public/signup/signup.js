const signupbtn = document.getElementById('signup-btn');
signupbtn.addEventListener('click',addUser);

function addUser(e){
    e.preventDefault();
    validate();
    const userName = document.getElementById('userName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    axios.post(`http://localhost:3000/signup`,{
        name: userName,
        email: email,
        password: password
    })
    .then(result=>{
        localStorage.setItem('token',result.data.token);
        alert(result.data.message);
        if(result.data.message === 'User already exists, Please Login' || 'Successfuly signed up'){
            window.location.replace('../login/login.html');
        }
        else{
            window.location.replace('../signup/signup.html');
        }    

    })  
    .catch(err => {
        console.log(err)
    })
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

