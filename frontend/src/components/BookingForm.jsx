import React, { useState, useEffect } from 'react';
import { fetchRoomTypes, createBooking } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Navbar2 from './Navbar2';

const BookingForm = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        guestData: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: '',
            idType: '',
            idNumber: '',
            dateOfBirth: '',
        },
        bookingData: {
            checkInDate: '',
            checkOutDate: '',
            roomType: '',
        },
    });
    const navigate = useNavigate();
    const idTypes = ["Passport", "Driver's License", "National ID", "Other"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRoomTypes();
                setRoomTypes(data);
            } catch (error) {
                console.error("Error fetching room types:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['firstName', 'lastName', 'email', 'phoneNumber', 'address', 'idType', 'idNumber', 'dateOfBirth'].includes(name)) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                guestData: {
                    ...prevFormData.guestData,
                    [name]: value,
                },
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                bookingData: {
                    ...prevFormData.bookingData,
                    [name]: value,
                },
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const guestData = {
                firstName: formData.guestData.firstName,
                lastName: formData.guestData.lastName,
                email: formData.guestData.email,
                phoneNumber: formData.guestData.phoneNumber,
                address: formData.guestData.address,
                idType: formData.guestData.idType,
                idNumber: formData.guestData.idNumber,
                dob: formData.guestData.dateOfBirth,
            };

            const bookingData = {
                roomId: formData.bookingData.roomType,
                checkInDate: formData.bookingData.checkInDate,
                checkOutDate: formData.bookingData.checkOutDate,
            };

            const response = await createBooking({ guestData, bookingData });

            if (response.bookingId) {
                navigate(`/payment/${response.bookingId}`);
                alert('Booking successful!');
            } else {
                throw new Error('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error("Error during booking submission:", error);
            alert('Booking failed. Please try again.');
        }
    };

    const nextStep = () => {
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const ProgressBar = () => (
        <div className="w-full mb-8">
            <div className="flex justify-between relative">
                <div className="absolute top-1/2 w-full h-1 bg-white/30 -z-10" />
                <div 
                    className="absolute top-1/2 h-1 bg-blue-500/70 transition-all duration-300" 
                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }} 
                />
                {[1, 2, 3].map(step => (
                    <div key={step} className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step <= currentStep ? 'bg-blue-500/80 text-white' : 'bg-white/30 text-white'
                        }`}>
                            {step < currentStep ? <Check size={16} /> : step}
                        </div>
                        <span className="mt-2 text-sm font-medium text-white">
                            {step === 1 ? 'Personal Info' : step === 2 ? 'ID Details' : 'Booking Details'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const inputClasses = "w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-white/60 text-white backdrop-blur-sm";
    const labelClasses = "block text-sm font-medium text-white mb-1";
    const selectClasses = "w-full bg-white/10 border border-white/20 p-3 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white backdrop-blur-sm";

    return (
        <div>
            <Navbar2/>
        <div className="fixed inset-0 w-full h-full">
            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="fixed inset-0 w-full h-full object-cover z-0"
            >
                <source src="/data/hotel-video.mp4" type="video/mp4" />
            </video>

            {/* Overlay */}
            <div className="fixed inset-0 bg-black/40 z-10" />

            {/* Main Content */}
            <div className="relative z-20 min-h-screen flex items-center justify-center px-4 py-12 overflow-y-auto">
                <form onSubmit={handleSubmit} className="backdrop-blur-md bg-white/10 p-8 rounded-xl shadow-2xl max-w-2xl w-full border border-white/20">
                    <h2 className="text-4xl font-bold mb-6 text-center text-white">Luxury Hotel Booking</h2>
                    
                    <ProgressBar />

                    <div className="space-y-6">
                        {currentStep === 1 && (
                            <div className="grid gap-6 md:grid-cols-2">
                                <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required className={inputClasses} />
                                <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required className={inputClasses} />
                                <input type="email" name="email" placeholder="Email" onChange={handleChange} required className={inputClasses} />
                                <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required className={inputClasses} />
                                <input type="text" name="address" placeholder="Address" onChange={handleChange} required className={`${inputClasses} md:col-span-2`} />
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid gap-6">
                                <div>
                                    <label className={labelClasses}>ID Type</label>
                                    <select name="idType" onChange={handleChange} required className={selectClasses}>
                                        <option value="">Select ID Type</option>
                                        {idTypes.map((type, index) => (
                                            <option key={index} value={type} className="text-gray-900">{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <input type="text" name="idNumber" placeholder="ID Number" onChange={handleChange} required className={inputClasses} />
                                <div>
                                    <label className={labelClasses}>Date of Birth</label>
                                    <input type="date" name="dateOfBirth" onChange={handleChange} required className={inputClasses} />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="grid gap-6">
                                <div>
                                    <label className={labelClasses}>Check-In Date</label>
                                    <input type="date" name="checkInDate" onChange={handleChange} required className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Check-Out Date</label>
                                    <input type="date" name="checkOutDate" onChange={handleChange} required className={inputClasses} />
                                </div>
                                <div>
                                    <label className={labelClasses}>Room Type</label>
                                    <select name="roomType" onChange={handleChange} required className={selectClasses}>
                                        <option value="">Select Room Type</option>
                                        {roomTypes.map((type) => (
                                            <option key={type.room_type_id} value={type.room_type_id} className="text-gray-900">
                                                {type.type_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between mt-8">
                            {currentStep > 1 && (
                                <button 
                                    type="button" 
                                    onClick={prevStep}
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
                                >
                                    Previous
                                </button>
                            )}
                            {currentStep < 3 ? (
                                <button 
                                    type="button" 
                                    onClick={nextStep}
                                    className="bg-blue-500/80 hover:bg-blue-600/80 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm ml-auto"
                                >
                                    Next
                                </button>
                            ) : (
                                <button 
                                    type="submit"
                                    className="bg-green-500/80 hover:bg-green-600/80 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm ml-auto"
                                >
                                    Complete Booking
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default BookingForm;


