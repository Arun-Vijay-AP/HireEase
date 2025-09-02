import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, MessageCircle, Calendar, Clock, User, MapPin, DollarSign, Briefcase, TrendingUp, Users, Target } from 'lucide-react';

const CurrentProcess = () => {
    const [animatedStats, setAnimatedStats] = useState({
        inProcess: 0,
        screening: 0,
        interview: 0,
        thisWeek: 0
    });

    const [candidates] = useState([
        {
            id: '1',
            jobId: 'job1',
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
            jobId: 'job2',
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
            jobId: 'job3',
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
            jobId: 'job1',
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
            jobId: 'job2',
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

    const [jobs] = useState([
        {
            id: 'job1',
            title: 'Frontend Developer',
            location: 'San Francisco, CA',
            salary: { min: 80000, max: 120000 }
        },
        {
            id: 'job2',
            title: 'Backend Developer',
            location: 'New York, NY',
            salary: { min: 90000, max: 130000 }
        },
        {
            id: 'job3',
            title: 'UI/UX Designer',
            location: 'Austin, TX',
            salary: { min: 60000, max: 90000 }
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const updateCandidateStatus = (candidateId, newStatus) => {
        // Mock function for updating candidate status
        console.log(`Updating candidate ${candidateId} to status: ${newStatus}`);
    };

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

    // Calculate stats from real data
    const realStats = {
        inProcess: candidates.filter(c => ['applied', 'screening', 'interview'].includes(c.status)).length,
        screening: candidates.filter(c => c.status === 'screening').length,
        interview: candidates.filter(c => c.status === 'interview').length,
        thisWeek: candidates.filter(c => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return c.appliedAt > weekAgo;
        }).length
    };

    // Animate stats on mount
    useEffect(() => {
        const animateValue = (start, end, duration, callback) => {
            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = Math.floor(start + (end - start) * easeOutQuart);
                callback(current);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            requestAnimationFrame(animate);
        };

        // Animate each stat with different delays
        setTimeout(() => animateValue(0, realStats.inProcess, 1500, (value) =>
            setAnimatedStats(prev => ({ ...prev, inProcess: value }))), 200);

        setTimeout(() => animateValue(0, realStats.screening, 1200, (value) =>
            setAnimatedStats(prev => ({ ...prev, screening: value }))), 400);

        setTimeout(() => animateValue(0, realStats.interview, 1800, (value) =>
            setAnimatedStats(prev => ({ ...prev, interview: value }))), 600);

        setTimeout(() => animateValue(0, realStats.thisWeek, 1600, (value) =>
            setAnimatedStats(prev => ({ ...prev, thisWeek: value }))), 800);
    }, []);

    // Job-wise application distribution
    const jobApplications = jobs.map(job => ({
        ...job,
        applications: candidates.filter(c => c.jobId === job.id).length,
        domains: candidates.filter(c => c.jobId === job.id).reduce((acc, candidate) => {
            const domain = candidate.skills[0] || 'Other';
            acc[domain] = (acc[domain] || 0) + 1;
            return acc;
        }, {})
    }));

    return (
        <div className="max-w-7xl mx-auto p-8 space-y-8">
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp1 {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp2 {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp3 {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp4 {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes bounceIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slide-up-1 {
          animation: slideUp1 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-up-2 {
          animation: slideUp2 0.8s ease-out 0.4s both;
        }
        
        .animate-slide-up-3 {
          animation: slideUp3 0.8s ease-out 0.6s both;
        }
        
        .animate-slide-up-4 {
          animation: slideUp4 0.8s ease-out 0.8s both;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out 0.5s both;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out 0.7s both;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        .job-item {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .domain-item {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .table-row {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .contact-item {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .professional-item {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .skill-item {
          animation: bounceIn 0.6s ease-out forwards;
        }
      `}</style>

            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Current Recruitment Process
                </h1>
                <p className="text-gray-600 text-lg">Manage active candidates and track their progress through the hiring pipeline</p>
            </div>

            {/* Animated Process Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    {
                        title: 'In Process',
                        value: animatedStats.inProcess,
                        subtitle: 'Active candidates',
                        icon: User,
                        color: 'blue',
                        delay: 'animate-slide-up-1'
                    },
                    {
                        title: 'Screening',
                        value: animatedStats.screening,
                        subtitle: 'Awaiting review',
                        icon: Eye,
                        color: 'yellow',
                        delay: 'animate-slide-up-2'
                    },
                    {
                        title: 'Interviews',
                        value: animatedStats.interview,
                        subtitle: 'Scheduled/Ongoing',
                        icon: MessageCircle,
                        color: 'purple',
                        delay: 'animate-slide-up-3'
                    },
                    {
                        title: 'This Week',
                        value: animatedStats.thisWeek,
                        subtitle: 'New applications',
                        icon: Calendar,
                        color: 'green',
                        delay: 'animate-slide-up-4'
                    }
                ].map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 ${stat.delay}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                                    <p className={`text-xs text-${stat.color}-600 mt-1`}>{stat.subtitle}</p>
                                </div>
                                <div className={`bg-${stat.color}-100 p-3 rounded-xl animate-pulse-slow`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Job Applications Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-in-left">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Briefcase className="w-6 h-6 mr-3 text-blue-600" />
                            Job Applications Overview
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Applications received per job posting</p>
                    </div>
                    <div className="p-6 space-y-4">
                        {jobApplications.map((job, index) => (
                            <div key={job.id} className="job-item opacity-0 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300" style={{ animationDelay: `${index * 200}ms` }}>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {job.applications} applications
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {job.location}
                                    </span>
                                    <span className="flex items-center">
                                        <DollarSign className="w-3 h-3 mr-1" />
                                        ${job.salary.min.toLocaleString()}-${job.salary.max.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-in-right">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-teal-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Target className="w-6 h-6 mr-3 text-green-600" />
                            Domain Distribution
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Skill domains of applicants by job</p>
                    </div>
                    <div className="p-6">
                        {jobApplications.map((job, jobIndex) => (
                            <div key={job.id} className="mb-6 last:mb-0">
                                <h4 className="font-semibold text-gray-900 mb-3">{job.title}</h4>
                                <div className="space-y-2">
                                    {Object.entries(job.domains).map(([domain, count], index) => (
                                        <div key={domain} className="domain-item opacity-0 flex items-center justify-between" style={{ animationDelay: `${(jobIndex * 3 + index) * 150}ms` }}>
                                            <span className="text-sm text-gray-700">{domain}</span>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out"
                                                        style={{ width: `${(count / Math.max(...Object.values(job.domains))) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 w-6 text-right">{count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/20 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Filter className="w-5 h-5 text-gray-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        >
                            <option value="all">All Statuses</option>
                            <option value="applied">Applied</option>
                            <option value="screening">Screening</option>
                            <option value="interview">Interview</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Animated Candidates Table */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-fade-in-up">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
                    <h2 className="text-xl font-bold text-gray-900">Active Candidates</h2>
                    <p className="text-sm text-gray-600 mt-1">{filteredCandidates.length} candidates in pipeline</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Experience</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Next Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCandidates.map((candidate, index) => (
                                <tr key={candidate.id} className="table-row opacity-0 hover:bg-blue-50 transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                                <span className="text-white font-bold text-sm">
                                                    {candidate.firstName[0]}{candidate.lastName[0]}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {candidate.firstName} {candidate.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">{candidate.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{candidate.position}</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {candidate.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(candidate.status)}`}>
                                            <span className="capitalize">{candidate.status}</span>
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-medium">{candidate.experience} years</div>
                                        <div className="text-sm text-gray-500 flex items-center">
                                            <DollarSign className="w-3 h-3 mr-1" />
                                            ${candidate.expectedSalary?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {candidate.appliedAt.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                const nextStatus = candidate.status === 'applied' ? 'screening' :
                                                    candidate.status === 'screening' ? 'interview' : 'hired';
                                                updateCandidateStatus(candidate.id, nextStatus);
                                            }}
                                            className="text-sm font-medium text-blue-600 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-200 hover:transform hover:scale-105"
                                        >
                                            {getNextAction(candidate.status)}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setSelectedCandidate(candidate)}
                                                className="text-blue-600 hover:text-blue-500 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="text-green-600 hover:text-green-500 p-2 rounded-lg hover:bg-green-50 transition-all duration-200">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button className="text-purple-600 hover:text-purple-500 p-2 rounded-lg hover:bg-purple-50 transition-all duration-200">
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
                                        <span className="text-white font-bold text-2xl">
                                            {selectedCandidate.firstName[0]}{selectedCandidate.lastName[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900">
                                            {selectedCandidate.firstName} {selectedCandidate.lastName}
                                        </h2>
                                        <p className="text-blue-600 font-semibold text-lg">{selectedCandidate.position}</p>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border mt-2 ${getStatusColor(selectedCandidate.status)}`}>
                                            <span className="capitalize">{selectedCandidate.status}</span>
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedCandidate(null)}
                                    className="text-gray-400 hover:text-gray-600 p-3 rounded-xl hover:bg-white/50 transition-all duration-200"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-600" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: User, label: 'Email', value: selectedCandidate.email, color: 'blue' },
                                            { icon: MessageCircle, label: 'Phone', value: selectedCandidate.phone, color: 'green' },
                                            { icon: MapPin, label: 'Location', value: selectedCandidate.location, color: 'purple' }
                                        ].map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={index} className="contact-item opacity-0 flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                                                    <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center`}>
                                                        <Icon className={`w-5 h-5 text-${item.color}-600`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                                                        <p className="text-xs text-gray-500">{item.label}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                                        Professional Details
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { icon: Briefcase, label: 'Experience', value: `${selectedCandidate.experience} years`, color: 'orange' },
                                            { icon: DollarSign, label: 'Expected Salary', value: `${selectedCandidate.expectedSalary?.toLocaleString()}`, color: 'green' },
                                            { icon: Calendar, label: 'Applied Date', value: selectedCandidate.appliedAt.toLocaleDateString(), color: 'blue' }
                                        ].map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <div key={index} className="professional-item opacity-0 flex items-center space-x-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                                                    <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center`}>
                                                        <Icon className={`w-5 h-5 text-${item.color}-600`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                                                        <p className="text-xs text-gray-500">{item.label}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="animate-fade-in-up">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Target className="w-5 h-5 mr-2 text-green-600" />
                                    Skills & Expertise
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {selectedCandidate.skills.map((skill, index) => (
                                        <span key={index} className="skill-item opacity-0 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-semibold border border-blue-200 hover:shadow-lg transition-all duration-300" style={{ animationDelay: `${index * 100}ms` }}>
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
                                    <button className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:transform hover:scale-105">
                                        Send Email
                                    </button>
                                    <button
                                        onClick={() => {
                                            const nextStatus = selectedCandidate.status === 'applied' ? 'screening' :
                                                selectedCandidate.status === 'screening' ? 'interview' : 'hired';
                                            updateCandidateStatus(selectedCandidate.id, nextStatus);
                                            setSelectedCandidate({ ...selectedCandidate, status: nextStatus });
                                        }}
                                        className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                                    >
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