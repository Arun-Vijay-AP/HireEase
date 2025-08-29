import React, { useState } from 'react';
import { BarChart3, Briefcase, Users, Settings } from 'lucide-react';
import RecruitmentAnalytics from './recruiter/RecruitmentAnalytics';
import CurrentProcess from './recruiter/CurrentProcess';
import JobCreation from './recruiter/JobCreation';
import RoundManagement from './recruiter/RoundManagement';

const RecruiterDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Tab Navigation */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex space-x-8">
                        {[
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'process', label: 'Current Process', icon: Users },
                            { id: 'jobs', label: 'Job Creation', icon: Briefcase },
                            { id: 'rounds', label: 'Round Management', icon: Settings }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2 ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'analytics' && <RecruitmentAnalytics />}
            {activeTab === 'process' && <CurrentProcess />}
            {activeTab === 'jobs' && <JobCreation />}
            {activeTab === 'rounds' && <RoundManagement />}
        </div>
    );
};

export default RecruiterDashboard;