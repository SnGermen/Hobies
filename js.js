let habbits = []
const HabitKey = 'HabitKey'
let globalActiveHabitId 


const page = {
    menu: document.querySelector('.menuList'),
    header: {
        h1: document.querySelector('.h1'),
        progressbaract: document.querySelector('.progressbaract'),
        progressName: document.querySelector('.progressName')
    },
    context: {
        daysContainer: document.getElementById('days'),
        nextDay: document.querySelector('.habDay')
    
    
    },
     
    popap: {
        index: document.getElementById('addHabbitPopup'),
        iconField: document.querySelector('.popupForm input[name="icon"]')
    }
           
 }


function loadData() {
    const habbitsStr = localStorage.getItem(HabitKey)
    const habbitArr = JSON.parse(habbitsStr)
    if (Array.isArray(habbitArr)) {
        habbits = habbitArr
    }
}

function saveData() {
    localStorage.setItem(HabitKey, JSON.stringify(habbits))
}

function togglePopup(){
    if(page.popap.index.classList.contains('coverHidenn')){
        page.popap.index.classList.remove('coverHidenn')
    } else {
        page.popap.index.classList.add('coverHidenn')
    }
    console.log('popap')
}


function resetForm(form, fields){
    for(const field of fields){
        form[field].value = ''

    }
}



function validateAndGetform(form, fields){
    const formData = new FormData(form)
    const res = {}
    for (const  field of fields){
        const fieldValue= formData.get(field);
        form[field].classList.remove('error')
        
        if(!fieldValue){
            form[field].classList.add('error')
            }
            res[field] = fieldValue
    }
    let  isValid = true
    for (const field of fields ){
        if(!res[field]){
            isValid = false
        }
    }
    if(!isValid){
        return
    }
    return res 
}

function rerendMenu(activeHabit) {
    document.querySelector('.menuList').innerHTML = ''
    page.menu.innerHTML = ''
    
    for (const habbit of habbits) {
 
    console.log(habbit) 
        const existed = document.querySelector(`[menuHabitId="${habbit.id}"]`)
        if (!existed) {
            const element = document.createElement('button')
            element.setAttribute('menuHabitId', habbit.id)
            element.classList.add('ielem')
            element.addEventListener('click', () => rerender(habbit.id))
            element.innerHTML = `<img src='img/${habbit.icon}.svg' alt='${habbit.name}' />`
            if (activeHabit === habbit.id) {
                element.classList.add('active')
            }

            page.menu.appendChild(element)
            continue
        }

        if (activeHabit === habbit.id) {
            existed.classList.add('active')
        } else {
            existed.classList.remove('active')
        }
    }
}



function rerenderHead(activeHabit){

    page.header.h1.innerText = activeHabit.name
    const progress = activeHabit.days.length / activeHabit.target > 1
        ? 100
        : activeHabit.days.length / activeHabit.target * 100
    page.header.progressName.innerText = progress.toFixed(0) + '%'
    page.header.progressbaract.setAttribute('style', `width: ${progress}%`)

}

function rerenderContent(activeHabit) {
    page.context.daysContainer.innerHTML = '';
    
    activeHabit.days.forEach((day, index) => {
        const element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `
            <div class="habDay">Day ${index + 1}</div>
            <div class="habbit_comment">${day.comment}</div>
            <button class="habdelete" onclick = "Deleted(${index})"'>
                <img src="img/delete.svg" alt="Delete day ${index + 1}">
            </button>`;
        page.context.daysContainer.appendChild(element);
    });

  page.context.nextDay.innerHTML = `Day ${activeHabit.days.length + 1}`;

}



function rerender(activeHabitId) {
    globalActiveHabitId = activeHabitId    
    const activeHabit = habbits.find((habit) => habit.id === activeHabitId) 
       if (!activeHabitId) {
        return
    } 
    
    document.location.replace(document.location.pathname + '#' + activeHabitId)
    rerendMenu(activeHabit.id)
    rerenderHead(activeHabit)
    rerenderContent(activeHabit)


}

function adDays(event) {
    event.preventDefault()
    const  data = validateAndGetform(event.target, ['comment'])
    if(!data){
        return
    }

    habbits = habbits.map(habbit =>{
        if (habbit.id == globalActiveHabitId){
            return{
                ...habbit,
                days: habbit.days.concat([{ comment: data.comment}])
            }
        }
        return habbit
    })
    resetForm(event.target, ['comment'])
    rerender(globalActiveHabitId)
    saveData()
    
}

function Deleted(index){
    
    habbits = habbits.map(habbit => {
        if(habbit.id === globalActiveHabitId){
             habbit.days.splice(index, 1)
             return {
                ...habbit,
                    days: habbit.days
            }
        }
        return habbit
    }) 
    rerender(globalActiveHabitId)
    saveData()
}




function setIcon(context, icon){
    page.popap.iconField.value = icon
    const activeIcn = document.querySelector('.icon.icon_active')
    activeIcn.classList.remove('icon_active')
    context.classList.add('icon_active')

}


function addHabit(event){
event.preventDefault
const  data = validateAndGetform(event.target, ['name', 'icon', 'target'])
if(!data){
    return
  }
  const maxId = habbits.reduce((acc, habbits) => acc > habbits.id ? acc : habbits.id, 0)
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: []

  });
 resetForm(event.target, ['name',  'target'])
 togglePopup() 
 saveData()
 rerender(maxId + 1)
}

(() => {
    loadData()
    const hashId = Number(document.location.hash.replace('#', ''));
    const urlHabbitId = habbits.find(h => h.id == hashId);
    if(urlHabbitId) {
    rerender(urlHabbitId.id) ;  
    } else{
        rerender(habbits[0].id);
    }
    
})()





















