import React from 'react';
import { BarChart3, TrendingUp, Users, Clock, Briefcase, Calendar } from 'lucide-react';

const RecruitmentAnalytics = () => {
    // Mock data for analytics
    const stats = {
        totalApplications: 1247,
        activeJobs: 12,
        candidatesHired: 89,
        averageTimeToHire: 18,
        roleDistribution: [
            { role: 'Frontend Developer', count: 45 },
            { role: 'Backend Developer', count: 38 },
            { role: 'Full Stack Developer', count: 52 },
            { role: 'UI/UX Designer', count: 28 },
            { role: 'DevOps Engineer', count: 22 },
            { role: 'Data Scientist', count: 31 }
        ],
        monthlyHires: [
            { month: 'Aug', count: 12 },
            { month: 'Sep', count: 18 },
            { month: 'Oct', count: 25 },
            { month: 'Nov', count: 22 },
            { month: 'Dec', count: 28 }
        ],
        statusDistribution: [
            { status: 'Applied', count: 156, percentage: 35 },
            { status: 'Screening', count: 89, percentage: 20 },
            { status: 'Interview', count: 67, percentage: 15 },
            { status: 'Hired', count: 89, percentage: 20 },
            { status: 'Rejected', count: 45, percentage: 10 }
        ]
    };

    const maxHires = Math.max(...stats.monthlyHires.map(m => m.count));

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruitment Analytics</h1>
                <p className="text-gray-600">Comprehensive insights into your hiring performance and trends</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Applications</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalApplications.toLocaleString()}</p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +12% from last month
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.activeJobs}</p>
                            <p className="text-xs text-blue-600 flex items-center mt-1">
                                <Briefcase className="w-3 h-3 mr-1" />
                                3 new this week
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <Briefcase className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Candidates Hired</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.candidatesHired}</p>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +8% success rate
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Avg. Time to Hire</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.averageTimeToHire} days</p>
                            <p className="text-xs text-orange-600 flex items-center mt-1">
                                <Clock className="w-3 h-3 mr-1" />
                                -2 days improved
                            </p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Role Distribution Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Users className="w-5 h-5 mr-2" />
                            Role Distribution
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats.roleDistribution.map((role, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${index % 6 === 0 ? 'from-blue-400 to-blue-600' :
                                                index % 6 === 1 ? 'from-purple-400 to-purple-600' :
                                                    index % 6 === 2 ? 'from-green-400 to-green-600' :
                                                        index % 6 === 3 ? 'from-yellow-400 to-yellow-600' :
                                                            index % 6 === 4 ? 'from-red-400 to-red-600' :
                                                                'from-indigo-400 to-indigo-600'
                                            }`}></div>
                                        <span className="text-sm font-medium text-gray-900">{role.role}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full bg-gradient-to-r ${index % 6 === 0 ? 'from-blue-400 to-blue-600' :
                                                        index % 6 === 1 ? 'from-purple-400 to-purple-600' :
                                                            index % 6 === 2 ? 'from-green-400 to-green-600' :
                                                                index % 6 === 3 ? 'from-yellow-400 to-yellow-600' :
                                                                    index % 6 === 4 ? 'from-red-400 to-red-600' :
                                                                        'from-indigo-400 to-indigo-600'
                                                    }`}
                                                style={{ width: `${(role.count / Math.max(...stats.roleDistribution.map(r => r.count))) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 w-8 text-right">{role.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Monthly Hires Histogram */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <BarChart3 className="w-5 h-5 mr-2" />
                            Monthly Hires (Last 5 Months)
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-end justify-between h-48 space-x-4">
                            {stats.monthlyHires.map((month, index) => (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <div className="w-full bg-gray-200 rounded-t-lg relative overflow-hidden">
                                        <div
                                            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out"
                                            style={{
                                                height: `${(month.count / maxHires) * 160}px`,
                                                minHeight: '20px'
                                            }}
                                        ></div>
                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold">
                                            {month.count}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm font-medium text-gray-600">{month.month}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Distribution Donut Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Candidate Status Distribution
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64">
                            {/* Donut Chart using CSS */}
                            <div className="absolute inset-0 rounded-full border-[40px] border-gray-200"></div>

                            {/* Applied - 35% */}
                            <div
                                className="absolute inset-0 rounded-full border-[40px] border-transparent border-t-blue-500"
                                style={{ transform: 'rotate(0deg)' }}
                            ></div>

                            {/* Screening - 20% */}
                            <div
                                className="absolute inset-0 rounded-full border-[40px] border-transparent border-t-yellow-500"
                                style={{ transform: 'rotate(126deg)' }}
                            ></div>

                            {/* Interview - 15% */}
                            <div
                                className="absolute inset-0 rounded-full border-[40px] border-transparent border-t-purple-500"
                                style={{ transform: 'rotate(198deg)' }}
                            ></div>

                            {/* Hired - 20% */}
                            <div
                                className="absolute inset-0 rounded-full border-[40px] border-transparent border-t-green-500"
                                style={{ transform: 'rotate(252deg)' }}
                            ></div>

                            {/* Rejected - 10% */}
                            <div
                                className="absolute inset-0 rounded-full border-[40px] border-transparent border-t-red-500"
                                style={{ transform: 'rotate(324deg)' }}
                            ></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{stats.totalApplications}</div>
                                    <div className="text-sm text-gray-600">Total</div>
                                </div>
                            </div>
                        </div>

                        <div className="ml-12 space-y-4">
                            {stats.statusDistribution.map((status, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className={`w-4 h-4 rounded-full ${status.status === 'Applied' ? 'bg-blue-500' :
                                            status.status === 'Screening' ? 'bg-yellow-500' :
                                                status.status === 'Interview' ? 'bg-purple-500' :
                                                    status.status === 'Hired' ? 'bg-green-500' :
                                                        'bg-red-500'
                                        }`}></div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-900">{status.status}</span>
                                            <span className="text-sm text-gray-600">{status.percentage}%</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{status.count} candidates</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentAnalytics;
