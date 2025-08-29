import React, { useState } from 'react';
import { Search, Filter, Eye, MessageCircle, Calendar, Clock, User, MapPin, DollarSign, Briefcase } from 'lucide-react';

const CurrentProcess = () => {
    const [candidates] = useState([
        {
            id: '1',
            userId: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1-555-0123',
            experience: 3,
            skills: ['React', 'TypeScript', 'Node.js', 'Python'],
            status: 'screening',
            appliedAt: new Date('2025-01-10'),
            position: 'Frontend Developer',
            location: 'San Francisco, CA',
            expectedSalary: 95000
        },
        {
            id: '2',
            userId: '2',
            firstName: 'Sarah',
            lastName: 'Wilson',
            email: 'sarah.wilson@email.com',
            phone: '+1-555-0124',
            experience: 5,
            skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
            status: 'interview',
            appliedAt: new Date('2025-01-08'),
            position: 'Backend Developer',
            location: 'New York, NY',
            expectedSalary: 110000
        },
        {
            id: '3',
            userId: '3',
            firstName: 'Mike',
            lastName: 'Chen',
            email: 'mike.chen@email.com',
            phone: '+1-555-0125',
            experience: 2,
            skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
            status: 'applied',
            appliedAt: new Date('2025-01-12'),
            position: 'UI/UX Designer',
            location: 'Austin, TX',
            expectedSalary: 75000
        },
        {
            id: '4',
            userId: '4',
            firstName: 'Emily',
            lastName: 'Rodriguez',
            email: 'emily.rodriguez@email.com',
            phone: '+1-555-0126',
            experience: 7,
            skills: ['React', 'Vue', 'Angular', 'GraphQL', 'MongoDB'],
            status: 'interview',
            appliedAt: new Date('2025-01-05'),
            position: 'Full Stack Developer',
            location: 'Seattle, WA',
            expectedSalary: 130000
        },
        {
            id: '5',
            userId: '5',
            firstName: 'David',
            lastName: 'Kim',
            email: 'david.kim@email.com',
            phone: '+1-555-0127',
            experience: 4,
            skills: ['Java', 'Spring Boot', 'Microservices', 'Docker'],
            status: 'screening',
            appliedAt: new Date('2025-01-11'),
            position: 'Backend Developer',
            location: 'Los Angeles, CA',
            expectedSalary: 105000
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'applied': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'screening': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'interview': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'hired': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getNextAction = (status) => {
        switch (status) {
            case 'applied': return 'Schedule Screening';
            case 'screening': return 'Technical Interview';
            case 'interview': return 'Final Round';
            default: return 'Review';
        }
    };

    const stats = {
        inProcess: candidates.filter(c => ['applied', 'screening', 'interview'].includes(c.status)).length,
        screening: candidates.filter(c => c.status === 'screening').length,
        interview: candidates.filter(c => c.status === 'interview').length,
        thisWeek: candidates.filter(c => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return c.appliedAt > weekAgo;
        }).length
    };

    return (
        <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Recruitment Process</h1>
                <p className="text-gray-600">Manage active candidates and track their progress through the hiring pipeline</p>
            </div>

            {/* Process Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Process</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inProcess}</p>
                            <p className="text-xs text-blue-600 mt-1">Active candidates</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Screening</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.screening}</p>
                            <p className="text-xs text-yellow-600 mt-1">Awaiting review</p>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-lg">
                            <Eye className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Interviews</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.interview}</p>
                            <p className="text-xs text-purple-600 mt-1">Scheduled/Ongoing</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <MessageCircle className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">This Week</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                            <p className="text-xs text-green-600 mt-1">New applications</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Statuses</option>
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Candidates Table */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-900">Active Candidates</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Action</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCandidates.map((candidate) => (
                                <tr key={candidate.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium text-sm">
                                                    {candidate.firstName[0]}{candidate.lastName[0]}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {candidate.firstName} {candidate.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{candidate.position}</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {candidate.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(candidate.status)}`}>
                                            <span className="capitalize">{candidate.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{candidate.experience} years</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            ${candidate.expectedSalary?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {candidate.appliedAt.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors duration-200">
                                            {getNextAction(candidate.status)}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="text-blue-600 hover:text-blue-500 p-1 rounded"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-500 p-1 rounded">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-500 p-1 rounded">
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Candidate Detail Modal */}
            {selectedCandidate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {selectedCandidate.firstName} {selectedCandidate.lastName}
                                        </h2>
                                        <p className="text-blue-600 font-medium">{selectedCandidate.position}</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-2 ${getStatusColor(selectedCandidate.status)}`}>
                                            <span className="capitalize">{selectedCandidate.status}</span>
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCandidate(null)}
                                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.email}</p>
                                                <p className="text-xs text-gray-500">Email</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <MessageCircle className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.phone}</p>
                                                <p className="text-xs text-gray-500">Phone</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.location}</p>
                                                <p className="text-xs text-gray-500">Location</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Professional Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                <Briefcase className="w-4 h-4 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.experience} years</p>
                                                <p className="text-xs text-gray-500">Experience</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                <DollarSign className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">${selectedCandidate.expectedSalary?.toLocaleString()}</p>
                                                <p className="text-xs text-gray-500">Expected Salary</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Calendar className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{selectedCandidate.appliedAt.toLocaleDateString()}</p>
                                                <p className="text-xs text-gray-500">Applied Date</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills & Expertise</h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCandidate.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Last updated: {new Date().toLocaleDateString()}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                        Send Email
                                    </button>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200">
                                        {getNextAction(selectedCandidate.status)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentProcess;