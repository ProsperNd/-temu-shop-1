"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Send, User, Mail, Phone as PhoneIcon, FileText, ArrowLeft, ArrowRight, Star, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { services } from "@/data/services";
import { contactInfo } from "@/constants/contact";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  phone: z.string().min(10, "Phone number too short"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function BookingClient() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const availableTimes = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      // Placeholder: In production, send to API or n8n workflow
      console.log("Booking submitted:", {
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        ...data,
      });
      setSubmitStatus("success");
      reset();
      setStep(1);
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !selectedService) return;
    if (step === 2 && !selectedDate) return;
    if (step === 3 && !selectedTime) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const progress = (step / 4) * 100;

  const stepContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Select a Service</h2>
            <p className="text-gray-600 mb-8">Choose the cleaning service you need for your booking.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  className={`p-6 border rounded-lg cursor-pointer transition-colors ${
                    selectedService === service.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedService(service.id)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">{service.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">${service.price} | {service.duration} min</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  {selectedService === service.id && (
                    <div className="flex items-center space-x-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={16} className="fill-current" />
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Select a Date</h2>
            <p className="text-gray-600 mb-8">Choose the date for your cleaning service. We are available Monday to Saturday.</p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </motion.div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Select a Time Slot</h2>
            <p className="text-gray-600 mb-8">Choose a convenient time for your appointment.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableTimes.map((time) => (
                <motion.button
                  key={time}
                  className={`p-4 border rounded-lg transition-colors ${
                    selectedTime === time ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onClick={() => setSelectedTime(time)}
                  whileHover={{ scale: 1.05 }}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
            <p className="text-gray-600 mb-8">Provide your details to complete the booking.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <User className="mr-2" size={20} />
                  Name
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="mr-2" size={20} />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <PhoneIcon className="mr-2" size={20} />
                  Phone
                </label>
                <input
                  type="tel"
                  {...register("phone")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FileText className="mr-2" size={20} />
                  Notes (Optional)
                </label>
                <textarea
                  rows={4}
                  {...register("notes")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special instructions or requirements?"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center pt-4 border-t"
              >
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <ArrowLeft size={20} />
                  <span>Previous</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={20} />
                  <span>{isSubmitting ? "Submitting..." : "Book Appointment"}</span>
                </button>
              </motion.div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Book Your Cleaning Service
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select your service, date, time, and provide your details to schedule a professional cleaning.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {step} of 4</span>
            <span>{step === 1 ? "Service" : step === 2 ? "Date" : step === 3 ? "Time" : "Details"}</span>
          </div>
        </div>

        {stepContent()}

        {step > 1 && step < 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mt-8"
          >
            <button
              onClick={prevStep}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft size={20} />
              <span>Previous</span>
            </button>
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>Next</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center"
          >
            <Check className="mx-auto mb-4 text-green-500" size={48} />
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="mb-4">Your appointment has been scheduled. We'll send a confirmation via email and WhatsApp shortly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=Hi, I just booked a service for ${selectedDate} at ${selectedTime}. Please confirm.`}
                className="bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
              >
                Contact via WhatsApp
              </a>
            </div>
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center"
          >
            <h3 className="text-xl font-semibold mb-2">Booking Failed</h3>
            <p className="mb-4">There was an error submitting your booking. Please try again or contact us directly.</p>
            <button
              onClick={() => setSubmitStatus("idle")}
              className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
