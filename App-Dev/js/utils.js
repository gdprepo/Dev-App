function refreshList(list, items)
{
    list.empty()

    items.forEach(element => {
        list.append(element)
    });

}
