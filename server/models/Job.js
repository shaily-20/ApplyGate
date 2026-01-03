import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship', 'Remote'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Technology', 'Design', 'Data', 'Product', 'Sales', 'Marketing', 'HR', 'Finance'],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Junior', 'Mid-level', 'Senior', 'Lead', 'Executive'],
      required: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    qualifications: {
      type: String,
    },
    applications: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['applied', 'reviewed', 'shortlisted', 'rejected'],
          default: 'applied',
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
