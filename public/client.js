document.addEventListener('DOMContentLoaded', function () {
  const week = document.querySelector('.week');

  week.addEventListener('click', (click) => {
    const value = click.target.getAttribute('value');
    const btn = click.target;
    let day = btn.parentElement;
    if (
      day.classList.contains('working') ||
      day.classList.contains('standby') ||
      value == 'person_add'
    ) {
      day = day.parentElement;
    }
    const form = day.querySelector('form');
    const edit = day.querySelector('input[value="mode_edit"]');
    const save = day.querySelector('input[value="save"]');
    const clearBtns = day.querySelectorAll('.clear');
    let workingElem = day.querySelector('.working');
    let standbyElem = day.querySelector('.standby');
    const expandMore = day.querySelector('input[value="expand_more"]');
    const expandLess = day.querySelector('input[value="expand_less"]');
    let waiterID = undefined;
    let waiterName = undefined;
    let actionString = form.getAttribute('action');
    const waiterSelect = day.querySelector('select');

    function addPerson() {
      waiterID = waiterSelect.value;
      waiterName = waiterSelect.children[waiterSelect.selectedIndex].innerHTML;
      if (!actionString.includes('?')) {
        actionString = actionString + `?${waiterID}=add`;
      } else {
        actionString = actionString + `&${waiterID}=add`;
      }
      form.setAttribute('action', actionString);
      if (!workingElem) {
        const workDiv = document.createElement('DIV');
        workDiv.classList.add('working');
        const heading = document.createElement('H3');
        heading.innerHTML = 'Working';
        workDiv.appendChild(heading);
        day.insertBefore(workDiv, form);
        workingElem = day.querySelector('.working');
        workingElem.style.display = 'grid';
      }
      if (workingElem.children.length < 7) {
        const btn = document.createElement('button');
        btn.value = waiterID;
        btn.classList.add('material-icons-round');
        btn.classList.add('clear');
        btn.innerHTML = 'clear';
        btn.style.display = 'inline-block';
        workingElem.appendChild(btn);
        const label = document.createElement('span');
        label.classList.add('waiter');
        label.innerHTML = waiterName;
        workingElem.appendChild(label);
      } else {
        if (!standbyElem) {
          const standbyDiv = document.createElement('DIV');
          standbyDiv.classList.add('standby');
          const heading = document.createElement('H3');
          heading.innerHTML = 'On standby';
          standbyDiv.appendChild(heading);
          day.insertBefore(standbyDiv, form);
          standbyElem = day.querySelector('.standby');
          standbyElem.style.display = 'grid';
        }
        const btn = document.createElement('button');
        btn.value = waiterID;
        btn.classList.add('material-icons-round');
        btn.classList.add('clear');
        btn.style.display = 'inline-block';
        btn.innerHTML = 'clear';
        standbyElem.appendChild(btn);
        const label = document.createElement('span');
        label.classList.add('waiter');
        label.innerHTML = waiterName;
        standbyElem.appendChild(label);
      }
      waiterSelect.children[waiterSelect.selectedIndex].remove();
    }

    switch (value) {
      case 'mode_edit':
        if (workingElem) {
          workingElem.style.display = 'grid';
        }
        if (standbyElem) {
          standbyElem.style.display = 'grid';
        }
        form.style.display = 'flex';
        save.style.display = 'inline-block';
        btn.style.visibility = 'hidden';
        clearBtns.forEach((clear) => {
          clear.style.display = 'inline-block';
        });
        if (expandMore) {
          expandMore.style.display = 'none';
        }
        if (expandLess) {
          expandLess.style.display = 'none';
        }
        break;
      case 'save':
        form.style.display = 'none';
        edit.style.visibility = 'visible';
        btn.style.display = 'none';
        clearBtns.forEach((clear) => {
          clear.style.display = 'none';
        });
        break;
      case 'expand_more':
        if (workingElem) {
          workingElem.style.display = 'grid';
        }
        if (standbyElem) {
          standbyElem.style.display = 'grid';
        }
        btn.setAttribute('value', 'expand_less');
        break;
      case 'expand_less':
        if (workingElem) {
          workingElem.style.display = 'none';
        }
        if (standbyElem) {
          standbyElem.style.display = 'none';
        }
        btn.setAttribute('value', 'expand_more');
        break;
      case 'person_add':
        if (waiterSelect.value) {
          addPerson(day);
        }
        break;
      default:
        waiterID = value;
        break;
    }

    if (waiterID && value != 'person_add') {
      waiterName = click.target.nextElementSibling.innerHTML;
      if (!actionString.includes('?')) {
        actionString = actionString + `?${waiterID}=delete`;
      } else {
        actionString = actionString + `&${waiterID}=delete`;
      }
      form.setAttribute('action', actionString);
      click.target.nextElementSibling.remove();
      click.target.remove();
      if (workingElem.children.length < 7 && standbyElem !== null) {
        workingElem.append(standbyElem.children[1]);
        workingElem.append(standbyElem.children[1]);
      }
      if (workingElem.children.length == 1) {
        workingElem.remove();
      }

      if (standbyElem !== null && standbyElem.children.length == 1) {
        standbyElem.remove();
      }
      const waiterOpt = document.createElement('option');
      waiterOpt.value = waiterID;
      waiterOpt.innerHTML = waiterName;
      waiterSelect.append(waiterOpt);
    }

    if (
      workingElem.children.length < 7 &&
      standbyElem == null &&
      day.classList.contains('full')
    ) {
      day.classList.remove('full');
    }

    if (
      workingElem.children.length == 7 &&
      standbyElem == null &&
      !day.classList.contains('full')
    ) {
      day.classList.add('full');
    }

    if (
      day.querySelector('.standby') == null &&
      day.classList.contains('full-w-standby')
    ) {
      day.classList.remove('full-w-standby');
      if (workingElem.children.length == 7) {
        day.classList.add('full');
      }
    }
    if (
      day.querySelector('.standby') &&
      !day.classList.contains('full-w-standby')
    ) {
      if (day.classList.contains('full')) {
        day.classList.remove('full');
      }
      day.classList.add('full-w-standby');
    }
  });
});
