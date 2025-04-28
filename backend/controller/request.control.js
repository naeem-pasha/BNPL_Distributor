const requestToDistributer = require("../models/request.model");
const UserDistributer = require("../models/UserDistributer.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios");

const createDistributer = async (req, res) => {
  try {
    const { name, email, phoneNo, address } = req.body;

    const existingUser = await UserDistributer.findOne({
      $or: [{ phoneNo }, { email }], // Match either phoneNo or email
    });

    // If a user is found with either phoneNo or email, return an error
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this phone number or email already exists.",
      });
    }
    // Generate random 8-character password
    const randomPassword = Math.random().toString(36).slice(-8);

    // Hash the password
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Send credentials via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or your email service provider
      auth: {
        user: "kashan.tech.io@gmail.com", // your email address
        pass: "oigk ecfe axuo pfcb", // your email password or app password
      },
    });

    const emailOptions = {
      from: "donotreply@example.com", // Sender's email
      to: email, // User's email
      subject: "Your Account Credentials",
      text: `Hello ${name},\n\nYour account has been created. Here are your credentials:\nEmail: ${email}\nPassword: ${randomPassword}\n\nThank you!`,
    };

    try {
      await transporter.sendMail(emailOptions);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Error while sending the email. Please try again later.",
        error: emailError,
      });
    }

    // Create a new user in the database
    const newUser = new UserDistributer({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      address,
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Distributer created successfully and credentials sent.",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message || "some thing went wrog",
    });
  }
};
const loginDistributer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await UserDistributer.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // 2. Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user._id, phoneNo: user.phoneNo }, // payload
      process.env.JWT_SECRET, // secret key from environment
      { expiresIn: "2d" } // expiration time
    );

    // 4. Set cookie with token
    const cookieOptions = {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: false,
    };

    res.cookie("token", token, cookieOptions);

    // 5. Remove password from output
    user.password = undefined;

    // 6. Send response
    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error Login",
      error: error.message,
    });
  }
};
const approvedRequest = async (req, res) => {
  try {
    const { responce, distributerNo } = req.body;
    const { _id } = responce;

    // Check if the request already exists
    const user = await requestToDistributer.findOne({ _id });

    if (user) {
      console.log(user);
      return res.status(200).json({
        success: false,
        message: "Already exists",
      }); // 🛑 Use "return" to stop execution after sending response
    }

    // Create a new request and save it
    const newRequestToDistributer = new requestToDistributer({
      ...responce,
      distributerNo,
    });

    await newRequestToDistributer.save(); // 🛠 Added "await" to ensure save completes before responding

    return res.status(200).json({
      success: true,
      message: "Distributor updated",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const allRequest = async (req, res) => {
  try {
    const { phoneNo } = req.user;
    const number = Number(phoneNo);

    const result = await requestToDistributer
      .find({
        distributerNo: number,
      })
      .sort({ createdAt: -1 });

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No data found for this phone number",
      });
    }
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error Login",
      error: error.message,
    });
  }
};

const sendAutherizedToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await requestToDistributer.findByIdAndUpdate(id, {
      isSendAutherizedToUser: true,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const sendInvoiceToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await requestToDistributer.findByIdAndUpdate(id, {
      isSendInvoiceToUser: true,
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryDate } = req.body;

    // Attempt to find and update the document
    const result = await requestToDistributer.findByIdAndUpdate(
      id,
      { deliveryDate },
      { new: true }
    );

    // If no result found, return an error response
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Return success response with updated data
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const sendDeliveryConfirmationToUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Send confirmation request to user service
    const result = await axios.put(
      `${process.env.USER_SERVER_URL}/api/user/confirmation-request/${id}`
    );

    // If the request does not return a result, handle the 404 error
    if (!result.data) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    // Find and update the request in the distributer database (assuming a model 'requestToDistributer' exists)
    const updateResult = await requestToDistributer.findByIdAndUpdate(
      id,
      {
        isSendConfirmationTouser: true,
      },
      { new: true }
    );

    // Check if the update result is valid
    if (!updateResult) {
      return res.status(404).json({
        success: false,
        message: "Distributer request update failed",
      });
    }

    // Return success response with updated data
    return res.status(200).json({
      success: true,
      message: "Delivery confirmation sent successfully",
      data: result.data, // or use updateResult if you want to return the distributer update result
    });
  } catch (error) {
    // Log the error and send a response
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending the delivery confirmation",
      error: error.message,
    });
  }
};

const acceptDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await requestToDistributer.findByIdAndUpdate(
      id,
      {
        isUserAcceptDelivery: true,
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Request to distributer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error accepting delivery:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getDistributerDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedId = `0${id}`;
    const distributer = await UserDistributer.findOne({
      phoneNo: updatedId,
    }).select("-password");

    if (!distributer) {
      return res.status(404).json({
        success: false,
        message: "Distributer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Distributer fetched successfully",
      data: distributer,
    });
  } catch (error) {
    console.error(error, `error in getDistributerDetail`);
    return res.status(500).json({
      success: false,
      message: "Error while getting distributer details",
      error: error.message,
    });
  }
};

module.exports = {
  allRequest,
  approvedRequest,
  createDistributer,
  loginDistributer,
  sendAutherizedToUser,
  sendInvoiceToUser,
  updateDate,
  acceptDelivery,
  sendDeliveryConfirmationToUser,
  getDistributerDetail,
};
