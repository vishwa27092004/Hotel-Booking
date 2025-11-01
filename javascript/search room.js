document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const resultsList = document.getElementById('resultsList');
    const roomCountSpan = document.getElementById('roomCount');

    // --- Simulated Room Data ---
    const ALL_ROOMS = [
        { id: 1, type: 'double', name: 'Deluxe Double Room', price: 150, guests: 2, image: 'r1.jpeg' },
        { id: 2, type: 'single', name: 'Standard Single', price: 80, guests: 1, image: 'r2.jpeg' },
        { id: 3, type: 'suite', name: 'Executive Suite', price: 350, guests: 4, image: 'r3.jpeg' },
        { id: 4, type: 'double', name: 'Ocean View Double', price: 220, guests: 2, image: 'r4.jpeg' },
        { id: 5, type: 'suite', name: 'Family Suite', price: 450, guests: 6, image: 'r5.jpeg' },
        { id: 6, type: 'single', name: 'Garden View Single', price: 95, guests: 1, image: 'r6.jpeg' },
    ];

    // --- Search Functionality ---
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const checkIn = document.getElementById('checkIn').value;
        const checkOut = document.getElementById('checkOut').value;
        const guests = parseInt(document.getElementById('guests').value);

        if (!checkIn || !checkOut || guests < 1) {
            alert('Please fill in all search criteria.');
            return;
        }

        const currentSearchResults = ALL_ROOMS.filter(room => room.guests >= guests);
        renderResults(currentSearchResults);
    });

    // --- Rendering Function ---
    function renderResults(rooms) {
        resultsList.innerHTML = ''; 
        roomCountSpan.textContent = rooms.length;

        if (rooms.length === 0) {
            resultsList.innerHTML = '<p class="placeholder-text">No rooms match your search criteria.</p>';
            return;
        }

        rooms.forEach(room => {
            const roomCard = document.createElement('div');
            roomCard.classList.add('room-card');
            
            roomCard.innerHTML = `
                <img src="${room.image}" alt="${room.name}" onerror="this.src='placeholder.jpg';">
                <div class="room-details">
                    <div class="room-info">
                        <h4>${room.name}</h4>
                        <p>Type: ${room.type.charAt(0).toUpperCase() + room.type.slice(1)} | Max Guests: ${room.guests}</p>
                    </div>
                    <div class="room-price">
                        <span class="price">$${room.price}</span>/night
                        <button onclick="bookRoom(${room.id})">Book Now</button>
                    </div>
                </div>
            `;
            resultsList.appendChild(roomCard);
        });
    }

    // --- Booking Function ---
    window.bookRoom = function(roomId) {
        const room = ALL_ROOMS.find(r => r.id === roomId);
        
        if (room) {
            // Retrieve selected dates
            const checkInValue = document.getElementById('checkIn').value;
            const checkOutValue = document.getElementById('checkOut').value;

            const checkIn = new Date(checkInValue);
            const checkOut = new Date(checkOutValue);

            // Calculate nights
            const timeDiff = checkOut - checkIn;
            const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (isNaN(nights) || nights <= 0) {
                alert('Please ensure Check-In date is before Check-Out date.');
                return;
            }

            // Compute total price
            const totalPrice = room.price * nights;

            // Prepare booking details
            const bookingDetails = {
                ...room,
                checkIn: checkInValue,
                checkOut: checkOutValue,
                nights,
                totalPrice
            };

            // Save to sessionStorage
            sessionStorage.setItem('selectedRoom', JSON.stringify(bookingDetails));

            alert(`Selected room: ${room.name}. Proceeding to payment...`);

            // Redirect to payment page
            window.location.href = 'payment.html';
        } else {
            alert('Error: Room not found.');
        }
    };
});
