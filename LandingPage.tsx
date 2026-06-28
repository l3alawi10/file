import { Link } from 'react-router-dom';
import {
  Shield, QrCode, FileCheck, Zap, Lock, Globe,
  GraduationCap, ArrowRight, CheckCircle, Scan, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const LandingPage = () => {
  const steps = [
    {
      icon: GraduationCap,
      title: 'Create Diploma',
      description: 'Enter student details and generate a professional diploma certificate instantly.',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: QrCode,
      title: 'Generate QR Code',
      description: 'Each diploma gets a unique, cryptographically secure QR code for verification.',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      icon: Scan,
      title: 'Scan & Verify',
      description: 'Anyone can scan the QR code to instantly verify the diploma\'s authenticity.',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Send,
      title: 'Share Securely',
      description: 'Export as PDF and share with confidence. Every verification is logged and secure.',
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Cryptographic Security',
      description: 'Each diploma uses a 256-bit random token that is impossible to guess or forge.',
    },
    {
      icon: FileCheck,
      title: 'Instant Verification',
      description: 'QR codes link directly to our secure verification portal with real-time status checks.',
    },
    {
      icon: Lock,
      title: 'Revocation Control',
      description: 'Institutions can revoke diplomas at any time, and verifiers will see updated status immediately.',
    },
    {
      icon: Zap,
      title: 'PDF Export',
      description: 'Generate professional PDF certificates ready for printing or digital distribution.',
    },
    {
      icon: Globe,
      title: 'Always Accessible',
      description: 'Verification works from any device with a camera and internet connection.',
    },
    {
      icon: CheckCircle,
      title: 'Status Tracking',
      description: 'Track Valid, Revoked, and Expired statuses with clear visual indicators.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xl font-bold text-slate-800">DiplomaVerify Pro</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/verify/demo" className="text-sm text-slate-600 hover:text-slate-800 transition-colors">
              Verify Diploma
            </Link>
            <Link to="/admin">
              <Button className="bg-slate-800 hover:bg-slate-700">
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(251, 191, 36, 0.3) 0%, transparent 50%),
                             radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div custom={0} variants={fadeInUp} className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Secure Certificate Verification System
            </motion.div>

            <motion.h1 custom={1} variants={fadeInUp} className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Verify Academic Credentials with{' '}
              <span className="text-amber-400">Confidence</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeInUp} className="text-lg text-slate-300 mb-8 leading-relaxed">
              Generate professional diplomas with unique QR codes, manage their lifecycle,
              and let anyone verify authenticity instantly. Built for educational institutions
              who demand security and professionalism.
            </motion.p>

            <motion.div custom={3} variants={fadeInUp} className="flex gap-4">
              <Link to="/admin">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                  Get Started <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/verify/demo">
                <Button size="lg" variant="outline" className="border-slate-500 text-white hover:bg-slate-800">
                  <Scan className="w-5 h-5 mr-2" /> Try Verification
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Code Block */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="hidden lg:block absolute top-1/2 right-12 -translate-y-1/2 w-80"
        >
          <div className="bg-slate-800 rounded-xl p-4 shadow-2xl border border-slate-700">
            <div className="flex gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-2 font-mono text-xs">
              <div className="text-slate-400">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-amber-400">token</span> ={' '}
                <span className="text-emerald-400">&quot;eR8pQ3xL9aV2fH7kZ1yB6d...&quot;</span>
              </div>
              <div className="text-slate-400">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-amber-400">status</span> ={' '}
                <span className="text-emerald-400">&quot;VERIFIED&quot;</span>
              </div>
              <div className="text-slate-500 mt-2 border-t border-slate-700 pt-2">
                <span className="text-emerald-500">&#10003;</span> Cryptographic signature valid
              </div>
              <div className="text-slate-500">
                <span className="text-emerald-500">&#10003;</span> Database record confirmed
              </div>
              <div className="text-slate-500">
                <span className="text-emerald-500">&#10003;</span> Status: <span className="text-emerald-400">ACTIVE</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              A streamlined process from diploma creation to verification. Secure at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 ${step.color} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-medium text-slate-400 mb-2">Step {i + 1}</div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Built for Security</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Every feature is designed with security and ease-of-use in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <h3 className="text-base font-semibold text-slate-800 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Diplomas?</h2>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Start generating and verifying professional diplomas today. No setup required —
            everything works right in your browser with local storage.
          </p>
          <Link to="/admin">
            <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
              Launch Admin Panel <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-slate-300">DiplomaVerify Pro</span>
          </div>
          <p className="text-xs">
            Secure certificate management with QR verification technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
