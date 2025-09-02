import React, { useState } from 'react';
import { Plus, Briefcase, MapPin, DollarSign, Clock, Users, BookOpen, Target, Save, Eye, Layers, CheckCircle } from 'lucide-react';

const JobCreation = () => {
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'full-time',
        description: '',
        requirements: [''],
        minSalary: 0,
        maxSalary: 0,
        minExperience: 0,
        maxExperience: 0,
        education: [''],
        skills: [''],
        benefits: [''],
        rounds: []
    });

    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleArrayInput = (field, index, value) => {
        const currentArray = formData[field];
        const newArray = [...currentArray];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field) => {
        const currentArray = formData[field];
        setFormData({ ...formData, [field]: [...currentArray, ''] });
    };

    const removeArrayItem = (field, index) => {
        const currentArray = formData[field];
        const newArray = currentArray.filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const addRound = () => {
        const newRound = {
            id: Date.now().toString(),
            jobId: '',
            name: '',
            type: 'screening',
            description: '',
            duration: 60,
            order: formData.rounds.length + 1,
            isActive: true
        };
        setFormData({ ...formData, rounds: [...formData.rounds, newRound] });
    };

    const updateRound = (index, field, value) => {
        const newRounds = [...formData.rounds];
        newRounds[index] = { ...newRounds[index], [field]: value };
        setFormData({ ...formData, rounds: newRounds });
    };

    const removeRound = (index) => {
        const newRounds = formData.rounds.filter((_, i) => i !== index);
        setFormData({ ...formData, rounds: newRounds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setSaved(true);
        setLoading(false);

        setTimeout(() => setSaved(false), 3000);
    };

    const departments = [
        'Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'
    ];

    const commonSkills = [
        'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'TypeScript', 'AWS', 'Docker',
        'Kubernetes', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST APIs', 'Git', 'Agile'
    ];

    const educationLevels = [
        'High School', 'Associate Degree', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Certification'
    ];

    const roundTypes = [
        { value: 'screening', label: 'Screening', description: 'Initial phone/video screening' },
        { value: 'technical', label: 'Technical', description: 'Technical assessment or coding challenge' },
        { value: 'hr', label: 'HR Interview', description: 'Cultural fit and HR discussion' },
        { value: 'final', label: 'Final Round', description: 'Final decision with leadership' }
    ];

    return (
        <div className="max-w-6xl mx-auto p-8">
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideInLeft {
                    from { 
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideInRight {
                    from { 
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes bounceIn {
                    0% { 
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% { 
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% { 
                        transform: scale(0.9);
                    }
                    100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slide-in-up {
                    animation: slideInUp 0.6s ease-out;
                }
                
                .animate-slide-in-left {
                    animation: slideInLeft 0.6s ease-out;
                }
                
                .animate-slide-in-right {
                    animation: slideInRight 0.6s ease-out;
                }
                
                .animate-scale-in {
                    animation: scaleIn 0.6s ease-out;
                }
                
                .animate-bounce-in {
                    animation: bounceIn 0.8s ease-out;
                }
            `}</style>

            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    Create Job Opening
                </h1>
                <p className="text-gray-600 text-lg">Define job requirements and attract the right candidates</p>
            </div>

            {/* Animated Tab Navigation */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 mb-8 animate-slide-in-up">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'basic', label: 'Basic Info', icon: Briefcase },
                            { id: 'details', label: 'Job Details', icon: BookOpen },
                            { id: 'requirements', label: 'Requirements', icon: Target },
                            { id: 'rounds', label: 'Interview Rounds', icon: Layers },
                            { id: 'preview', label: 'Preview', icon: Eye }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-300 flex items-center space-x-2 hover:transform hover:scale-105 ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600 bg-blue-50 rounded-t-lg'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="animate-slide-in-left">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="e.g., Senior Frontend Developer"
                                    />
                                </div>

                                <div className="animate-slide-in-right">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department *</label>
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="animate-slide-in-left" style={{ animationDelay: '200ms' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            placeholder="e.g., San Francisco, CA (Remote)"
                                        />
                                    </div>
                                </div>

                                <div className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="animate-slide-in-left" style={{ animationDelay: '400ms' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Salary Range *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.minSalary}
                                                onChange={(e) => setFormData({ ...formData, minSalary: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Min"
                                            />
                                        </div>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.maxSalary}
                                                onChange={(e) => setFormData({ ...formData, maxSalary: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="animate-slide-in-right" style={{ animationDelay: '400ms' }}>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Range (Years) *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.minExperience}
                                                onChange={(e) => setFormData({ ...formData, minExperience: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Min"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.maxExperience}
                                                onChange={(e) => setFormData({ ...formData, maxExperience: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Details Tab */}
                    {activeTab === 'details' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="animate-slide-in-up">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                                />
                            </div>

                            <div className="animate-slide-in-up" style={{ animationDelay: '200ms' }}>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Key Responsibilities</label>
                                <div className="space-y-3">
                                    {formData.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center space-x-3 animate-slide-in-left" style={{ animationDelay: `${index * 100}ms` }}>
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => handleArrayInput('requirements', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="e.g., Develop and maintain React applications"
                                            />
                                            {formData.requirements.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('requirements', index)}
                                                    className="text-red-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('requirements')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Responsibility</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Benefits & Perks</label>
                                <div className="space-y-3">
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => handleArrayInput('benefits', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="e.g., Health insurance, Remote work flexibility"
                                            />
                                            {formData.benefits.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('benefits', index)}
                                                    className="text-red-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('benefits')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Benefit</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Requirements Tab */}
                    {activeTab === 'requirements' && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills</label>
                                <div className="space-y-3">
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => handleArrayInput('skills', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="e.g., React, TypeScript, Node.js"
                                            />
                                            {formData.skills.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('skills', index)}
                                                    className="text-red-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('skills')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Skill</span>
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 mb-2">Common Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {commonSkills.map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                onClick={() => {
                                                    if (!formData.skills.includes(skill)) {
                                                        const newSkills = [...formData.skills];
                                                        const emptyIndex = newSkills.findIndex(s => s === '');
                                                        if (emptyIndex !== -1) {
                                                            newSkills[emptyIndex] = skill;
                                                        } else {
                                                            newSkills.push(skill);
                                                        }
                                                        setFormData({ ...formData, skills: newSkills });
                                                    }
                                                }}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 hover:transform hover:scale-105"
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Education Requirements</label>
                                <div className="space-y-3">
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <select
                                                value={edu}
                                                onChange={(e) => handleArrayInput('education', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            >
                                                <option value="">Select Education Level</option>
                                                {educationLevels.map(level => (
                                                    <option key={level} value={level}>{level}</option>
                                                ))}
                                            </select>
                                            {formData.education.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('education', index)}
                                                    className="text-red-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('education')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Education Requirement</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Interview Rounds Tab */}
                    {activeTab === 'rounds' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Interview Rounds Configuration</h3>
                                    <p className="text-gray-600 mt-1">Define the interview process for this position</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addRound}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:transform hover:scale-105 shadow-lg"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Round</span>
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.rounds.map((round, index) => (
                                    <div key={round.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 animate-slide-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-900">Round {index + 1}</h4>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeRound(index)}
                                                className="text-red-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Round Name *</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={round.name}
                                                    onChange={(e) => updateRound(index, 'name', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    placeholder="e.g., Technical Interview"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Round Type *</label>
                                                <select
                                                    required
                                                    value={round.type}
                                                    onChange={(e) => updateRound(index, 'type', e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                >
                                                    {roundTypes.map(type => (
                                                        <option key={type.value} value={type.value}>{type.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
                                            <textarea
                                                required
                                                value={round.description}
                                                onChange={(e) => updateRound(index, 'description', e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="Describe what this round involves..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes) *</label>
                                            <input
                                                type="number"
                                                required
                                                value={round.duration}
                                                onChange={(e) => updateRound(index, 'duration', parseInt(e.target.value))}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                placeholder="60"
                                            />
                                        </div>
                                    </div>
                                ))}

                                {formData.rounds.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 animate-pulse">
                                        <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">No interview rounds configured yet</p>
                                        <button
                                            type="button"
                                            onClick={addRound}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:transform hover:scale-105"
                                        >
                                            Add First Round
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Preview Tab with Enhanced Design */}
                    {activeTab === 'preview' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200 animate-scale-in">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{formData.title || 'Job Title'}</h2>
                                        <p className="text-blue-600 font-semibold text-lg">{formData.department || 'Department'}</p>
                                    </div>
                                    <div className="text-right bg-white p-4 rounded-xl shadow-lg">
                                        <p className="text-sm text-gray-600">Salary Range</p>
                                        <p className="text-xl font-bold text-gray-900">
                                            ${formData.minSalary?.toLocaleString()} - ${formData.maxSalary?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">{formData.location || 'Location'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700 capitalize">{formData.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white p-3 rounded-lg">
                                        <Users className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">
                                            {formData.minExperience}-{formData.maxExperience} years experience
                                        </span>
                                    </div>
                                </div>

                                {formData.description && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                                        <p className="text-gray-700 whitespace-pre-wrap">{formData.description}</p>
                                    </div>
                                )}

                                {formData.requirements.filter(r => r).length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {formData.requirements.filter(r => r).map((req, index) => (
                                                <li key={index} className="text-gray-700">{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {formData.skills.filter(s => s).length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.filter(s => s).map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.benefits.filter(b => b).length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {formData.benefits.filter(b => b).map((benefit, index) => (
                                                <li key={index} className="text-gray-700">{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {formData.rounds.length > 0 && (
                                    <div className="mb-6 bg-white p-6 rounded-xl">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                            <Layers className="w-5 h-5 mr-2 text-purple-600" />
                                            Interview Process ({formData.rounds.length} rounds)
                                        </h3>
                                        <div className="space-y-3">
                                            {formData.rounds.map((round, index) => (
                                                <div key={round.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg animate-slide-in-right" style={{ animationDelay: `${index * 100}ms` }}>
                                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                        <span className="text-purple-600 font-bold text-sm">{round.order}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-semibold text-gray-900">{round.name}</span>
                                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full capitalize">
                                                                {round.type}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{round.description}</p>
                                                    </div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {round.duration}min
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                            {activeTab !== 'basic' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tabs = ['basic', 'details', 'requirements', 'rounds', 'preview'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex - 1]);
                                    }}
                                    className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                                >
                                    Previous
                                </button>
                            )}

                            {activeTab !== 'preview' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tabs = ['basic', 'details', 'requirements', 'rounds', 'preview'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex + 1]);
                                    }}
                                    className="px-6 py-3 text-sm font-semibold text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                                >
                                    Next
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                className="px-6 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:transform hover:scale-105"
                            >
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:scale-105 shadow-lg"
                            >
                                <Save className="w-4 h-4" />
                                <span>{loading ? 'Publishing...' : 'Publish Job'}</span>
                            </button>
                        </div>
                    </div>

                    {saved && (
                        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl animate-bounce-in">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                <div>
                                    <p className="text-green-800 font-bold">✓ Job opening created successfully!</p>
                                    <p className="text-green-700 text-sm">Candidates can now apply for this position</p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default JobCreation;