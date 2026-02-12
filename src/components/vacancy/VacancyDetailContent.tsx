import { motion } from 'framer-motion';
import { FileText, CheckCircle, Briefcase, DollarSign, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import type { Vacancy } from '../../types/vacancy';

interface VacancyDetailContentProps {
  vacancy: Vacancy;
}

const VacancyDetailContent = ({ vacancy }: VacancyDetailContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-line">{vacancy.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Responsibilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-green-600" />
            Key Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {vacancy.responsibilities.map((responsibility, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{responsibility}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Requirements & Qualifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {vacancy.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2" />
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Salary Range */}
      {vacancy.salary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Compensation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {vacancy.salary.min.toLocaleString()} - {vacancy.salary.max.toLocaleString()}
              </span>
              <span className="text-gray-600">{vacancy.salary.currency} per month</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {vacancy.benefits && vacancy.benefits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-green-600" />
              Benefits & Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vacancy.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default VacancyDetailContent;
