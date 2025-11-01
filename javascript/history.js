document.addEventListener('DOMContentLoaded', () => {
    const historyList = document.getElementById('historyList');
    const noHistoryMessage = document.getElementById('noHistoryMessage');

    loadBookingHistory();

    function loadBookingHistory() {
        const historyJSON = localStorage.getItem('bookingHistory');
        historyList.innerHTML = '';

        if (!historyJSON) {
            showNoHistoryMessage();
            return;
        }

        try {
            const history = JSON.parse(historyJSON);

            if (history.length === 0) {
                showNoHistoryMessage();
                return;
            }

            history.forEach((booking, index) => {
                const card = document.createElement('div');
                card.classList.add('booking-card');

                card.innerHTML = `
                    <div class="booking-details">
                        <h3>${booking.roomName}</h3>
                        <p>Nights: ${booking.nights} | Paid: ₹ ${booking.price.toFixed(2)}</p>
                        <p>Confirmation ID: ${booking.confId}</p>
                    </div>
                    <div class="booking-summary">
                        <span class="date">Booked On: ${booking.date}</span>
                        <span class="price">₹ ${booking.price.toFixed(2)}</span>
                        <div class="action-buttons">
                            <button class="edit-btn">✏️ Edit</button>
                            <button class="delete-btn">🗑️ Delete</button>
                        </div>
                    </div>
                `;

                // --- Delete ---
                card.querySelector('.delete-btn').addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this booking?')) {
                        deleteBooking(index);
                    }
                });

                // --- Edit ---
                card.querySelector('.edit-btn').addEventListener('click', () => {
                    editBooking(index, booking);
                });

                historyList.appendChild(card);
            });

        } catch (e) {
            console.error('Failed to parse booking history:', e);
            showNoHistoryMessage();
        }
    }

    function showNoHistoryMessage() {
        noHistoryMessage.textContent = 'You have no past bookings yet.';
        historyList.appendChild(noHistoryMessage);
    }

    function deleteBooking(index) {
        const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        history.splice(index, 1);
        localStorage.setItem('bookingHistory', JSON.stringify(history));
        loadBookingHistory();
    }

    function editBooking(index, booking) {
        const newDate = prompt('Enter a new booking date (YYYY-MM-DD):', booking.date);
        if (!newDate) return;

        if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
            alert('Please enter a valid date format (YYYY-MM-DD).');
            return;
        }

        const history = JSON.parse(localStorage.getItem('bookingHistory')) || [];
        history[index].date = newDate;
        localStorage.setItem('bookingHistory', JSON.stringify(history));

        alert('Booking date updated successfully!');
        loadBookingHistory();
    }
});
