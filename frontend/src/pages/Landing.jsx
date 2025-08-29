import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function Landing() {
    return (
        <div className="relative min-h-screen bg-gray-900 text-white flex flex-col">
            <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'url("/src/assets/hero-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>

            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center p-8">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    Your <span className="text-indigo-400">Next Opportunity</span>,
                    <br /> Automated with <span className="text-teal-400">AI</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
                    Streamlining the hiring process for candidates and recruiters alike, leveraging intelligent automation and powerful analytics.
                </p>
                <div className="mb-10 text-lg justify-center text-white">
                    Get into this new era of hiring with <span className="text-indigo-400 font-semibold">AI HireEase</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                    <Link to="/signin">
                        <Button color="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 px-8" size="large">
                            SignIn
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button color="bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 px-8" size="large">
                            SignUp
                        </Button>
                    </Link>
                </div>
            </main>

            <footer className="relative z-10 p-4 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} AI HireEase. All rights reserved.
            </footer>
        </div>
    );
}
