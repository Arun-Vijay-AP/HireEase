import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Clock, Briefcase, Calendar, Target, Award, Zap } from 'lucide-react';

const RecruitmentAnalytics = () => {
    const [animatedStats, setAnimatedStats] = useState({
        totalApplications: 0,
        activeJobs: 0,
        candidatesHired: 0,
        averageTimeToHire: 0
    });

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
        setTimeout(() => animateValue(0, stats.totalApplications, 1500, (value) =>
            setAnimatedStats(prev => ({ ...prev, totalApplications: value }))), 200);

        setTimeout(() => animateValue(0, stats.activeJobs, 1200, (value) =>
            setAnimatedStats(prev => ({ ...prev, activeJobs: value }))), 400);

        setTimeout(() => animateValue(0, stats.candidatesHired, 1800, (value) =>
            setAnimatedStats(prev => ({ ...prev, candidatesHired: value }))), 600);

        setTimeout(() => animateValue(0, stats.averageTimeToHire, 1600, (value) =>
            setAnimatedStats(prev => ({ ...prev, averageTimeToHire: value }))), 800);
    }, []);

    const maxHires = Math.max(...stats.monthlyHires.map(m => m.count));
    const maxRoleCount = Math.max(...stats.roleDistribution.map(r => r.count));

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
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes growUp {
          from { height: 0; }
          to { height: var(--final-height); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @keyframes drawPath {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes countUp {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
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
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out 0.7s both;
        }
        
        .animate-pulse-slow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        .animate-grow-up {
          animation: growUp 1s ease-out forwards;
        }
        
        .animate-draw-path {
          animation: drawPath 0.8s ease-out forwards;
        }
        
        .animate-count-up {
          animation: countUp 0.8s ease-out 1.2s both;
        }
        
        .role-item {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .role-item:nth-child(1) { animation-delay: 0.2s; }
        .role-item:nth-child(2) { animation-delay: 0.4s; }
        .role-item:nth-child(3) { animation-delay: 0.6s; }
        .role-item:nth-child(4) { animation-delay: 0.8s; }
        .role-item:nth-child(5) { animation-delay: 1.0s; }
        .role-item:nth-child(6) { animation-delay: 1.2s; }
        
        .bar-item {
          animation: growUp 1s ease-out forwards;
        }
        
        .bar-item:nth-child(1) { animation-delay: 0.3s; }
        .bar-item:nth-child(2) { animation-delay: 0.6s; }
        .bar-item:nth-child(3) { animation-delay: 0.9s; }
        .bar-item:nth-child(4) { animation-delay: 1.2s; }
        .bar-item:nth-child(5) { animation-delay: 1.5s; }
      `}</style>

            <div className="mb-8 animate-fade-in">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Recruitment Analytics
                </h1>
                <p className="text-gray-600 text-lg">Comprehensive insights into your hiring performance and trends</p>
            </div>

            {/* Animated Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    {
                        title: 'Total Applications',
                        value: animatedStats.totalApplications,
                        change: '+12%',
                        icon: Users,
                        color: 'blue',
                        delay: 'animate-slide-up-1'
                    },
                    {
                        title: 'Active Jobs',
                        value: animatedStats.activeJobs,
                        change: '3 new',
                        icon: Briefcase,
                        color: 'purple',
                        delay: 'animate-slide-up-2'
                    },
                    {
                        title: 'Candidates Hired',
                        value: animatedStats.candidatesHired,
                        change: '+8%',
                        icon: Award,
                        color: 'green',
                        delay: 'animate-slide-up-3'
                    },
                    {
                        title: 'Avg. Time to Hire',
                        value: animatedStats.averageTimeToHire,
                        change: '-2 days',
                        icon: Clock,
                        color: 'orange',
                        delay: 'animate-slide-up-4'
                    }
                ].map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <div key={index} className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105 ${metric.delay}`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mb-1">
                                        {metric.title.includes('Time') ? `${metric.value} days` : metric.value.toLocaleString()}
                                    </p>
                                    <p className={`text-xs flex items-center ${metric.change.includes('+') ? 'text-green-600' :
                                            metric.change.includes('-') ? 'text-orange-600' : 'text-blue-600'
                                        }`}>
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        {metric.change} from last month
                                    </p>
                                </div>
                                <div className={`bg-${metric.color}-100 p-3 rounded-xl animate-pulse-slow`}>
                                    <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Animated Status Distribution Donut Chart */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-fade-in-up">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Zap className="w-6 h-6 mr-3 text-purple-600" />
                            Candidate Pipeline Status
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Real-time distribution of candidates across hiring stages</p>
                    </div>
                    <div className="p-8">
                        <div className="flex items-center justify-center">
                            <div className="relative w-80 h-80">
                                {/* Animated Donut Chart */}
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="35"
                                        fill="none"
                                        stroke="#f3f4f6"
                                        strokeWidth="8"
                                    />

                                    {stats.statusDistribution.map((status, index) => {
                                        const colors = ['#3b82f6', '#eab308', '#8b5cf6', '#10b981', '#ef4444'];
                                        const startAngle = stats.statusDistribution.slice(0, index).reduce((sum, s) => sum + (s.percentage * 3.6), 0);
                                        const endAngle = startAngle + (status.percentage * 3.6);
                                        const largeArcFlag = status.percentage > 50 ? 1 : 0;

                                        const x1 = 50 + 35 * Math.cos((startAngle - 90) * Math.PI / 180);
                                        const y1 = 50 + 35 * Math.sin((startAngle - 90) * Math.PI / 180);
                                        const x2 = 50 + 35 * Math.cos((endAngle - 90) * Math.PI / 180);
                                        const y2 = 50 + 35 * Math.sin((endAngle - 90) * Math.PI / 180);

                                        return (
                                            <path
                                                key={index}
                                                d={`M 50 50 L ${x1} ${y1} A 35 35 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                                fill={colors[index]}
                                                className="hover:opacity-80 transition-opacity duration-300 animate-draw-path"
                                                style={{ animationDelay: `${index * 400}ms` }}
                                            />
                                        );
                                    })}
                                </svg>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center bg-white rounded-full p-4 shadow-lg">
                                        <div className="text-3xl font-bold text-gray-900 animate-count-up">{stats.totalApplications}</div>
                                        <div className="text-sm text-gray-600">Total Candidates</div>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-12 space-y-4">
                                {stats.statusDistribution.map((status, index) => (
                                    <div key={index} className="role-item opacity-0 flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300" style={{ animationDelay: `${index * 200}ms` }}>
                                        <div className={`w-4 h-4 rounded-full animate-pulse-slow ${status.status === 'Applied' ? 'bg-blue-500' :
                                            status.status === 'Screening' ? 'bg-yellow-500' :
                                                status.status === 'Interview' ? 'bg-purple-500' :
                                                    status.status === 'Hired' ? 'bg-green-500' :
                                                        'bg-red-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-900">{status.status}</span>
                                                <span className="text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
                                                    {status.percentage}%
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">{status.count} candidates</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Animated Monthly Hires Histogram */}
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-in-right">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <BarChart3 className="w-6 h-6 mr-3 text-green-600" />
                            Monthly Hires Trend
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">Hiring performance over the last 5 months</p>
                    </div>
                    <div className="p-6">
                        <div className="flex items-end justify-between h-56 space-x-4">
                            {stats.monthlyHires.map((month, index) => (
                                <div key={index} className="flex flex-col items-center flex-1 group">
                                    <div className="w-full bg-gray-100 rounded-t-xl relative overflow-hidden hover:shadow-lg transition-all duration-300">
                                        <div
                                            className="bar-item bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 rounded-t-xl transition-all duration-1000 ease-out hover:from-purple-500 hover:via-purple-400 hover:to-purple-300"
                                            style={{
                                                height: `${(month.count / maxHires) * 180}px`,
                                                minHeight: '30px',
                                                '--final-height': `${(month.count / maxHires) * 180}px`
                                            }}
                                        ></div>
                                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold bg-black/20 px-2 py-1 rounded-full">
                                            {month.count}
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
                                        {month.month}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500">
                                <span className="text-green-600 font-semibold">↗ 15% increase</span> in hiring velocity
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Role Distribution */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-in-left">
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <Target className="w-6 h-6 mr-3 text-blue-600" />
                        Role Distribution
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Current candidate applications by role</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {stats.roleDistribution.map((role, index) => {
                            const percentage = maxRoleCount > 0 ? (role.count / maxRoleCount) * 100 : 0;

                            return (
                                <div key={index} className="role-item opacity-0 group hover:bg-gray-50 p-3 rounded-lg transition-all duration-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${index % 6 === 0 ? 'from-blue-400 to-blue-600' :
                                                index % 6 === 1 ? 'from-purple-400 to-purple-600' :
                                                    index % 6 === 2 ? 'from-green-400 to-green-600' :
                                                        index % 6 === 3 ? 'from-yellow-400 to-yellow-600' :
                                                            index % 6 === 4 ? 'from-red-400 to-red-600' :
                                                                'from-indigo-400 to-indigo-600'
                                                } animate-pulse-slow`}></div>
                                            <span className="text-sm font-semibold text-gray-900">{role.role}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-full">
                                            {role.count}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-3 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out ${index % 6 === 0 ? 'from-blue-400 to-blue-600' :
                                                index % 6 === 1 ? 'from-purple-400 to-purple-600' :
                                                    index % 6 === 2 ? 'from-green-400 to-green-600' :
                                                        index % 6 === 3 ? 'from-yellow-400 to-yellow-600' :
                                                            index % 6 === 4 ? 'from-red-400 to-red-600' :
                                                                'from-indigo-400 to-indigo-600'
                                                } group-hover:scale-105 transform origin-left`}
                                            style={{
                                                width: `${percentage}%`,
                                                animationDelay: `${index * 200}ms`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Conversion Rate</h3>
                        <Target className="w-6 h-6 opacity-80" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        {Math.round((stats.candidatesHired / stats.totalApplications) * 100)}%
                    </div>
                    <p className="text-blue-100 text-sm">Applications to hires ratio</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Active Pipeline</h3>
                        <Users className="w-6 h-6 opacity-80" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        {stats.statusDistribution.filter(s => ['Applied', 'Screening', 'Interview'].includes(s.status)).reduce((sum, s) => sum + s.count, 0)}
                    </div>
                    <p className="text-purple-100 text-sm">Candidates in process</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">This Month</h3>
                        <Calendar className="w-6 h-6 opacity-80" />
                    </div>
                    <div className="text-3xl font-bold mb-2">
                        {stats.monthlyHires[stats.monthlyHires.length - 1].count}
                    </div>
                    <p className="text-green-100 text-sm">New applications</p>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentAnalytics;