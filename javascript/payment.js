document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upiPaymentForm');
    const upiInput = document.getElementById('upiVpa');
    // ⭐ THE FIX IS HERE: Ensure pinInput targets the upiPin element
    const pinInput = document.getElementById('upiPin'); 
    const payButton = document.getElementById('payButton');
    const errorMessage = document.getElementById('errorMessage');
    
    // Display elements
    const roomNameDisplay = document.getElementById('roomNameDisplay');
    const nightsDisplay = document.getElementById('nightsDisplay');
    const rateDisplay = document.getElementById('rateDisplay');
    const totalAmountDisplay = document.getElementById('totalAmountDisplay');
    
    // Modal elements
    const modal = document.getElementById('confirmationModal');
    const modalRoomName = document.getElementById('modalRoomName');
    const modalNights = document.getElementById('modalNights');
    const modalTotalPaid = document.getElementById('modalTotalPaid');
    const modalConfId = document.getElementById('modalConfId');

    let selectedRoom = null;
    // paymentAmount now holds the actual total price
    let paymentAmount = 0; 

    // --- Data Retrieval and Display ---
    function loadBookingData() {
        const storedRoomData = sessionStorage.getItem('selectedRoom');
        
        if (storedRoomData) {
            selectedRoom = JSON.parse(storedRoomData);
            
            // CORE CHANGE: Calculate the correct total price
            const singleNightRate = selectedRoom.price;
            const numberOfNights = selectedRoom.nights;
            const totalPrice = singleNightRate * numberOfNights; 
            
            // Update paymentAmount to the correct total price
            paymentAmount = totalPrice; 
            // Also update selectedRoom object to hold the total price for history saving
            selectedRoom.totalPrice = totalPrice;
            
            roomNameDisplay.textContent = selectedRoom.name;
            nightsDisplay.textContent = numberOfNights;
            rateDisplay.textContent = `₹ ${singleNightRate.toFixed(2)}/night`;
            
            totalAmountDisplay.textContent = `₹ ${paymentAmount.toFixed(2)}`; 
            payButton.textContent = `Pay Now (₹ ${paymentAmount.toFixed(2)})`;
            
        } else {
            roomNameDisplay.textContent = 'ERROR: No booking data found.';
            payButton.disabled = true;
            showError('Please go back and select a room first.');
            window.location.href = 'search room.html';
        }
    }

    loadBookingData();

    // --- Utility Functions ---
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.visibility = 'visible';
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.visibility = 'hidden';
    }

    function isValidUpiVpa(vpa) {
        const re = /^[\w.-]+@[\w.-]+$/;
        return re.test(String(vpa).toLowerCase());
    }
    
    // --- Modal Functions ---
    function showConfirmationModal(room, confId) {
        modalRoomName.textContent = room.name;
        modalNights.textContent = room.nights;
        // Use the calculated totalPrice
        modalTotalPaid.textContent = `₹ ${room.totalPrice.toFixed(2)}`; 
        
        document.getElementById('modalConfId').textContent = confId; 
        
        modal.style.display = 'block';
    }
    
    window.closeModal = function() {
        modal.style.display = 'none';
        // Only redirect to history.html when the modal is closed
        window.location.href = 'history.html'; 
    };
    
    // --- History Saving Function ---
    function saveBookingToHistory(booking) {
        const history = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
        // Add the new booking to the start of the array
        history.unshift(booking);
        localStorage.setItem('bookingHistory', JSON.stringify(history));
    }


    // --- Payment Submission Logic (MODIFIED) ---
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        clearError();
        
        const upiVpa = upiInput.value.trim();
        // The value of the PIN field is now correctly captured
        const upiPin = pinInput.value.trim(); 

        if (!selectedRoom) {
            showError('Booking data missing. Cannot proceed with payment.');
            return;
        }

        const isSuccessUpi = upiVpa === 'success@upi';
        const isCorrectPin = upiPin === '1234'; 

        if (!isValidUpiVpa(upiVpa)) {
             showError('Please enter a valid UPI ID.');
             return;
        }

        if (upiPin.length !== 4) { 
            showError('Please enter a 4-digit UPI PIN.');
            return;
        }
        
        // --- Validation passed, start process ---

        // Disable inputs and button during processing
        upiInput.disabled = true;
        pinInput.disabled = true;
        payButton.disabled = true; 
        
        payButton.textContent = 'Processing...';
        payButton.style.backgroundColor = '#FFC107'; 

        // Generate a random 5-digit Confirmation ID
        const confId = Math.floor(Math.random() * 90000) + 10000;
        
        
        if (isSuccessUpi && isCorrectPin) { 
            const newBooking = {
                id: Date.now(),
                // Date format from original file for consistency
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                roomName: selectedRoom.name,
                // The 'price' field in history.js expects the total amount paid
                price: selectedRoom.totalPrice, 
                nights: selectedRoom.nights,
                confId: confId
            };
            
            // Save data to history now
            saveBookingToHistory(newBooking);
            
            // --- SIMULATED PAYMENT SUCCESS (5 seconds delay) ---
            setTimeout(() => {
                // Clear session storage on successful booking
                sessionStorage.removeItem('selectedRoom'); 
                
                // Show confirmation modal
                showConfirmationModal(selectedRoom, confId);
                
                payButton.textContent = 'Payment Successful!';
                payButton.style.backgroundColor = '#008745';
            }, 5000); 

        } else {
            // --- SIMULATED PAYMENT FAILURE (5 seconds delay) ---
            setTimeout(() => {
                let failureMessage = 'Payment failed. ';
                if (!isSuccessUpi) {
                    failureMessage += 'Please check UPI ID (Use "success@upi").';
                } else if (!isCorrectPin) {
                    failureMessage += 'Incorrect PIN (Use 1234).';
                }
                
                showError(failureMessage);
                
                // Re-enable inputs on failure
                payButton.disabled = false;
                upiInput.disabled = false;
                pinInput.disabled = false;
                payButton.textContent = `Pay Now (₹ ${paymentAmount.toFixed(2)})`;
                payButton.style.backgroundColor = '#4CAF50';
            }, 5000);
        }
    });
});