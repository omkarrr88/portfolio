import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        title: string;
        description: string;
        technologies: string[];
        githubLink: string;
        details?: string;
        architecture?: string;
        challenges?: string;
    } | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8 mt-2">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 pr-10">
                                {project.title}
                            </h2>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                {project.description}
                            </p>
                        </div>

                        <div className="space-y-8">
                            {project.details && (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        The Problem & Solution
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.details}</ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {project.architecture && (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        System Architecture
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.architecture}</ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {project.challenges && (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                                        Challenges Overcame
                                    </h3>
                                    <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.challenges}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-10 flex flex-wrap gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-md"
                            >
                                <Github size={20} />
                                View Source Code
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
