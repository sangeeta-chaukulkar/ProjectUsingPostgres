const form = document.getElementById('uploadfileform')

const id= localStorage.getItem('id');

form.addEventListener('submit', (e) => {
    e.preventDefault()
    var formData = new FormData(form);
    axios.patch(`http://localhost:3000/uploadImage/${id}`,formData)
    .then(result=>{
        alert(result.data.message);
        const img = document.createElement("img");
        img.src = `data:image/jpeg;base64,${result.result.rows[0].base64data}`
        img.style.border = "10px solid orange";
        img.style.borderRadius = "10px";
        document.body.appendChild(img);
    })  
    .catch(err => {
        console.log(err)
    })  
})

