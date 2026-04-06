import bcrypt from "bcrypt";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Internship from "../models/Internship.js";
import Application from "../models/Application.js";
import Appointment from "../models/Appointment.js";

export const seedInitialData = async () => {
  try {
    const hashedPassword = await bcrypt.hash("password123", 10);

    const [companyUser] = await User.findOrCreate({
      where: { email: "company@example.com" },
      defaults: {
        firstName: "Acme",
        lastName: "Recruiter",
        email: "company@example.com",
        password: hashedPassword,
        role: "company",
        status: "active",
        phoneNumber: "0781234567",
      },
    });

    const [studentUser] = await User.findOrCreate({
      where: { email: "student@example.com" },
      defaults: {
        firstName: "Jane",
        lastName: "Doe",
        email: "student@example.com",
        password: hashedPassword,
        role: "student",
        status: "active",
        phoneNumber: "0787654321",
      },
    });

    const [doctorUser] = await User.findOrCreate({
      where: { email: "doctor@example.com" },
      defaults: {
        firstName: "Dr.",
        lastName: "Who",
        email: "doctor@example.com",
        password: hashedPassword,
        role: "admin",
        status: "active",
        phoneNumber: "0789999999",
      },
    });

    const [company] = await Company.findOrCreate({
      where: { companyName: "Acme Corp" },
      defaults: {
        userId: companyUser.id,
        industry: "Technology",
        description: "A leading tech company offering internships worldwide.",
        website: "https://acme.example.com",
        location: "Remote",
        logo: "https://acme.example.com/logo.png",
      },
    });

    const [internship] = await Internship.findOrCreate({
      where: { title: "Software Engineering Intern", companyId: company.id },
      defaults: {
        description: "Work with our engineering team on real-world product features.",
        requirements: "Familiarity with JavaScript, Git, and REST APIs.",
        location: "Remote",
        duration: "3 months",
        stipend: "500.00",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        status: "open",
      },
    });

    const [application] = await Application.findOrCreate({
      where: {
        userId: studentUser.id,
        internshipId: internship.id,
      },
      defaults: {
        status: "interview",
        coverLetter: "I am excited to apply for this internship and contribute to your engineering team.",
        resume: "resume.pdf",
      },
    });

    await Appointment.findOrCreate({
      where: {
        patient_id: studentUser.id,
        doctor_id: doctorUser.id,
        appointment_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10),
        appointment_time: "10:00:00",
      },
      defaults: {
        status: "pending",
        reason: "Initial consultation for internship guidance.",
        doctor_notes: null,
        location: "Room 101",
        start_time: "10:00:00",
        end_time: "10:30:00",
        duration: "30 minutes",
        approved_by: null,
        approved_at: null,
        cancelled_by: null,
        cancelled_at: null,
        cancellation_reason: null,
      },
    });

    console.log("Initial seed data created successfully.");
  } catch (error) {
    console.error("Error seeding initial data:", error);
    throw error;
  }
};
