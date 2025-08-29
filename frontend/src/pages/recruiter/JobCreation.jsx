import React, { useState } from 'react';
import { Plus, Briefcase, MapPin, DollarSign, Clock, Users, BookOpen, Target, Save, Eye } from 'lucide-react';

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
        benefits: ['']
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

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Job Opening</h1>
                <p className="text-gray-600">Define job requirements and attract the right candidates</p>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {[
                            { id: 'basic', label: 'Basic Info', icon: Briefcase },
                            { id: 'details', label: 'Job Details', icon: BookOpen },
                            { id: 'requirements', label: 'Requirements', icon: Target },
                            { id: 'preview', label: 'Preview', icon: Eye }
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
                    </nav>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Senior Frontend Developer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="e.g., San Francisco, CA (Remote)"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="full-time">Full-time</option>
                                        <option value="part-time">Part-time</option>
                                        <option value="contract">Contract</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.minSalary}
                                                onChange={(e) => setFormData({ ...formData, minSalary: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Range (Years) *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="number"
                                                required
                                                value={formData.minExperience}
                                                onChange={(e) => setFormData({ ...formData, minExperience: parseInt(e.target.value) })}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Round Details Tab */}
                                <div className="space-y-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Round Details</label>
                                    <div className="space-y-4">
                                        {formData.rounds && formData.rounds.length > 0 && formData.rounds.map((round, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Round Name</label>
                                                    <input
                                                        type="text"
                                                        value={round.name}
                                                        onChange={e => {
                                                            const newRounds = [...formData.rounds];
                                                            newRounds[idx].name = e.target.value;
                                                            setFormData({ ...formData, rounds: newRounds });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                                        placeholder={`e.g., Assignment, Technical, HR`}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs text-gray-500 mb-1">Minimum Marks to Pass</label>
                                                    <input
                                                        type="number"
                                                        value={round.minMarks}
                                                        onChange={e => {
                                                            const newRounds = [...formData.rounds];
                                                            newRounds[idx].minMarks = e.target.value;
                                                            setFormData({ ...formData, rounds: newRounds });
                                                        }}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded"
                                                        placeholder="e.g., 60"
                                                    />
                                                </div>
                                                {formData.rounds.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newRounds = formData.rounds.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, rounds: newRounds });
                                                        }}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newRounds = formData.rounds ? [...formData.rounds, { name: '', minMarks: '' }] : [{ name: '', minMarks: '' }];
                                                setFormData({ ...formData, rounds: newRounds });
                                            }}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Add Round</span>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Define each round (e.g., Assignment, Technical, HR) and the minimum marks required to pass to the next round.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Job Details Tab */}
                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={8}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities</label>
                                <div className="space-y-3">
                                    {formData.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={(e) => handleArrayInput('requirements', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., Develop and maintain React applications"
                                            />
                                            {formData.requirements.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('requirements', index)}
                                                    className="text-red-600 hover:text-red-500 p-2"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('requirements')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Responsibility</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks</label>
                                <div className="space-y-3">
                                    {formData.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={benefit}
                                                onChange={(e) => handleArrayInput('benefits', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., Health insurance, Remote work flexibility"
                                            />
                                            {formData.benefits.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('benefits', index)}
                                                    className="text-red-600 hover:text-red-500 p-2"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('benefits')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
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
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                                <div className="space-y-3">
                                    {formData.skills.map((skill, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => handleArrayInput('skills', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="e.g., React, TypeScript, Node.js"
                                            />
                                            {formData.skills.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeArrayItem('skills', index)}
                                                    className="text-red-600 hover:text-red-500 p-2"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('skills')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
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
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Education Requirements</label>
                                <div className="space-y-3">
                                    {formData.education.map((edu, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <select
                                                value={edu}
                                                onChange={(e) => handleArrayInput('education', index, e.target.value)}
                                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                                    className="text-red-600 hover:text-red-500 p-2"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addArrayItem('education')}
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Add Education Requirement</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preview Tab */}
                    {activeTab === 'preview' && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{formData.title || 'Job Title'}</h2>
                                        <p className="text-blue-600 font-medium">{formData.department || 'Department'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Salary Range</p>
                                        <p className="text-lg font-bold text-gray-900">
                                            ${formData.minSalary?.toLocaleString()} - ${formData.maxSalary?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700">{formData.location || 'Location'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-700 capitalize">{formData.type}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
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
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Benefits & Perks</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {formData.benefits.filter(b => b).map((benefit, index) => (
                                                <li key={index} className="text-gray-700">{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                        <div className="flex items-center space-x-4">
                            {activeTab !== 'basic' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tabs = ['basic', 'details', 'requirements', 'preview'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex - 1]);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                >
                                    Previous
                                </button>
                            )}

                            {activeTab !== 'preview' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tabs = ['basic', 'details', 'requirements', 'preview'];
                                        const currentIndex = tabs.indexOf(activeTab);
                                        setActiveTab(tabs[currentIndex + 1]);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    Next
                                </button>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                Save as Draft
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-4 h-4" />
                                <span>{loading ? 'Publishing...' : 'Publish Job'}</span>
                            </button>
                        </div>
                    </div>

                    {saved && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-800 font-medium">✓ Job opening created successfully!</p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default JobCreation;