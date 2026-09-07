function searchLocations() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let text = cards[i].innerText.toLowerCase();
        if (text.includes(input)) {
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}
