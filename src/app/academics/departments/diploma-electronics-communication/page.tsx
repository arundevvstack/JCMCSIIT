import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Target, ShieldCheck, Briefcase, Building2, Users, Mail, Globe, CheckCircle2, TrendingUp, BookOpen, ChevronRight, GraduationCap, AlertTriangle, BookMarked, Wrench } from 'lucide-react';
import { facultyData } from '@/data/faculty';
import { departmentsData } from '@/data/departments';
import { LabAccordion } from '@/components/departments/lab-accordion';

export const metadata: Metadata = {
  title: 'Diploma in Electronics & Communication | JCMCSIIT',
  description: 'AICTE-approved Diploma in Electronics & Communication at JCMCSIIT. Empowering students to innovate and create sustainable solutions for societal and global challenges.',
};

const DOC_FACULTY = [
  { name: 'Dr. LIJI R F', designation: 'PROFESSOR & HOD ECE', qualification: 'ME, Ph.D' },
  { name: 'Dr. LIM J SEELAN', designation: 'PROFESSOR', qualification: 'ME, Ph.D' },
  { name: 'Mrs. TINI S RUSSEL', designation: 'ASSOCIATE PROFESSOR', qualification: 'ME' },
  { name: 'Mrs. SEENA M K', designation: 'ASSISTANT PROFESSOR', qualification: 'ME' },
  { name: 'Mrs. ARATHIRAJ B S', designation: 'ASSISTANT PROFESSOR', qualification: 'ME' },
  { name: 'Mrs. ANOJA C M', designation: 'ASSISTANT PROFESSOR', qualification: 'ME' },
  { name: 'Mr. ALWIN MOSES', designation: 'ASSISTANT PROFESSOR', qualification: 'M.Tech' },
  { name: 'Mrs. AISWARYA N R', designation: 'ASSISTANT PROFESSOR', qualification: 'M.Tech' }
];

const TECHNICAL_STAFF = [
  { name: 'Mr. SANAL KUMAR T', designation: 'INSTRUCTOR GRADE 2' },
  { name: 'Mrs. LIJI V K', designation: 'INSTRUCTOR GRADE 2' },
  { name: 'Mr. NOBLE REJI S S', designation: 'INSTRUCTOR GRADE 2' },
  { name: 'Mr. VIMAL RAJ S R', designation: 'INSTRUCTOR GRADE 2' }
];

const LABS = [
  {
    name: 'Communication Lab',
    room: '305B',
    incharge: 'Mrs. TINI S RUSSEL',
    instructor: 'Mr. NOBLE REJI S S',
    equipment: 'Analog IC RTL-SDR Kit, Color Digital storage oscilloscope, Cathode ray oscilloscope, Regulated power supply, Signal generator, Digital IC trainer Kit, Digital & Analog IC Tester, Desktop (MATLAB)',
    experiments: [
      { part: 'PART A (HARDWARE)', list: ['FM generation and demodulation using PLL', 'Generation and detection of BPSK', 'Generation and detection of PCM signals', 'Generation and detection of Delta modulated signals'] },
      { part: 'PART B (SOFTWARE)', list: ['Eye diagram', 'Performance of waveform coding using PCM', 'Pulse shaping and matched filtering', 'Error performance of BPSK', 'Error performance of QPSK'] },
      { part: 'PART C', list: ['Familiarization with SDR', 'FM reception using SDR'] }
    ]
  },
  {
    name: 'Microwave and Optical Lab',
    room: '302A',
    incharge: 'Mrs. ANOJA C M',
    instructor: 'Mr. NOBLE REJI S',
    equipment: 'Gunn power supply, Gunn oscillator, VSWR meter, slotted line, Variable attenuator, Isolator, Reflex Klystron power supply, Detector mount, Dielectric antenna, H plane sectoral horn antenna, klystron mount, wave guide stand, pyramidal horn, variable attenuator, wave guide twist, Precision movable short, Tunable port, Wave guide cavity resonator, Magic tee, Multi hole directional coupler, H plane tee, E plane Tee Frequency meter. Color digital storage oscilloscope, Single mode fiber optic cable, Fiber optic passive component module, 1550nm fiber optic laser source and detector module, Fiber optic power meter, APD module, Laser diode and glass fiber-based fiber optic trainer, Fiber optic analog link at 660nm for using plastic fiber and Fiber optic trainer kit, Desktop. Strain measurement trainer, Thermocouple module, LVDT characteristics trainer, RTD characteristic trainer, Transducer measurement using photo cell and Pressure measurement trainer.'
  },
  {
    name: 'Electronic Circuits Lab',
    incharge: 'Mrs. TINTU S S',
    instructor: 'Mr. SANAL KUMAR T',
    equipment: 'Color Digital Storage oscilloscope, Cathode ray oscilloscope, Regulated power supply, signal generator, Analog IC Tester, Desktop (PSpice)'
  },
  {
    name: 'Digital Electronics Lab',
    incharge: 'Mrs. SEENA M K',
    instructor: 'Mrs. LIJI V K',
    equipment: 'FPGA kit, Digital IC trainer kit, Digital & Analog IC tester, Color Digital storage oscilloscope, Cathode RayOscilloscope, Power supply, Signal generator, Desktop (Xilinx) Arduino Uno Board, Computer with Arduino driver software, USB cable and wires',
    experiments: [
      { part: 'PART A', list: ['Study of logic gates', 'Realization of functions using basic gates and universal gates (SOP and POS forms)', 'Realization and verification of De Morgan’s Theorem', 'Design and Realization of half, full adder, half subtractor and full subtractor using basic gates and universal gates', 'Code Converters', '4 bit adder/subtractor and BCD adder using IC 7483', 'Magnitude Comparators', 'BCD to Decimal decoder and 7-segment decoder and display', 'Realization of MUX and DEMUX using gates', 'Study of Flip Flops using gates and ICs (7474 and 7476)', 'Asynchronous and Synchronous Counters', 'Shift Registers, Ring counter and Johnson counter'] },
      { part: 'PART B', list: ['Study of FPGA and Verilog and Realization of logic gates using Verilog', 'Adders using Verilog', '4-Bit Magnitude Comparator using Verilog', 'Mux & Demux using Verilog', 'Flip Flops & Counters using Verilog', 'Design of code converters using Verilog', 'Universal shift register using Verilog'] }
    ]
  },
  {
    name: 'Simulation Lab',
    incharge: 'Mrs. ARATHIRAJ B S',
    instructor: 'Mrs. LIJI V K',
    equipment: 'Workstations Microcontroller kit (8051), Stepper motor controller card with motor-IC-08, ADC-0809 interfacing module 8/16 channel ADC-IC-01, DAC-0800 interfacingmodule- IC02, 16×2 LCD display module IC11, DSP Kit (AKG-Mic, speaker 400W, Code composer studio)'
  },
  {
    name: 'Project Lab',
    incharge: 'Mrs. AISWARYA N R',
    instructor: 'Mr. SANALKUMAR T',
    equipment: 'LCR Q meter, Dedicated Systems, FPGA kit, Color Digital storage oscilloscope, Cathode ray oscilloscope, Regulated power supply, Signal generator, Bread board, Digital IC trainer kit, Analog IC tester, Function generator, multi meter, Access to scienceDirect-Elsevier Journal, Projector, 3D printer'
  },
  {
    name: 'Research Lab',
    incharge: 'Dr. LIM J SEELAN',
    instructor: 'Mr. VIMALRAJ S R',
    equipment: 'Dedicated Systems, Color Digital Storage Oscilloscope, Power supply, Turnitin plagiarism checker, Access to scienceDirect-Elsevier Journal, V Lab, Multimeter, DELNET'
  },
  {
    name: 'Electromagnetics Lab',
    experiments: [
      { part: 'PART A', list: ['STUDYOF FIBER OPTICS', 'MEASUREMENT OF NUMERICAL APERTURE OF A FIBER', 'V-I CHARACTERISTICS OF LED', 'V-I CHARACTERISTICS OF LASER DIODE'] },
      { part: 'PART B', list: ['FAMILIARIZATION TO CST SOFTWARE', 'PATCH ANTENNA USING CST SOFTWARE', 'ANTENNA PATTERN MEASUREMENT'] },
      { part: 'PART C', list: ['FAMILIARISATION OF MICROWAVE COMPONENTS AND EQUIPMENTS', 'GUNN DIODE CHARACTERISTICS', 'REFLEX KLYSTRON MODE CHARACTERISTICS', 'VSWR AND FREQUENCY MEASUREMENT', 'VERIFICATION OF THE RELATION BETWEEN GUIDE WAVELENGTH, CUTOFF WAVELENGTH AND FREE SPACE WAVELENGTH'] }
    ]
  },
  {
    name: 'Analog Integrated Circuits Lab',
    experiments: [
      { part: 'PART A', list: ['Familiarization of Operational Amplifiers-Inverting and Non inverting amplifiers, frequency response, Adder, Integrator, Comparators', 'Measurement of Op-amp parameters', 'RC Phase shift oscillator', 'Schmitt trigger circuit using Op-amp', 'Astable and monostable multivibrators using Op-amp', 'Waveform generators using Op-amp- Triangular and Saw tooth', 'Precision rectifiers using Op-amp'] },
      { part: 'PART B', list: ['Astable and monostable multivibrators using Timer IC555', 'D/A Converters-R-2R Ladder circuit', 'Study of PLL IC: free running frequency, lock range, capture range'] },
      { part: 'PART C', list: ['Simulation experiments any 3 from cycleI', 'Simulation experiment 3 or 4 from cycleII'] }
    ]
  },
  {
    name: 'Digital Signal Processing Lab',
    experiments: [
      { part: 'EXPERIMENTS', list: ['Simulation of Signals', 'Verification of the Properties of DFT', 'Familiarization of DSP Hardware', 'Linear convolution', 'FFT of signals', 'IFFT with FFT', 'FIR low pass filter', 'Overlap Add Block Convolution'] }
    ]
  },
  {
    name: 'Analog Circuits & Simulation Lab',
    experiments: [
      { part: 'PART A', list: ['RC integrating and differentiating circuits (Transient analysis with different inputs and frequency response)', 'Clipping and clamping circuits (Transients and transfer characteristics)', 'RC coupled CE amplifier - frequency response characteristics', 'Cascode amplifier -frequency response', 'Low frequency oscillators –RC phase shift', 'Power amplifiers (transformer less) - Class B and Class AB'] },
      { part: 'PART B (PSPICE)', list: ['RC integrating and differentiating circuits', 'Clipping and clamping circuits', 'Cascode amplifier -frequency response', 'Feedbackamplifier', 'Low frequency oscillators –RC phase shift', 'RC coupled CE amplifier - frequency response characteristics'] }
    ]
  },
  {
    name: 'Microcontroller Lab',
    experiments: [
      { part: 'PART A', list: ['Familiarization of 8051 Trainer Kit', 'Data transfer/exchange between specified memory locations', 'Finding the largest/smallest number from a series', 'Sorting (Ascending/Descending) of data'] },
      { part: 'PART B', list: ['Arithmetic Operations', 'Sum of elements in a series of 8 bit data', 'Code conversion'] },
      { part: 'PART C', list: ['Stepper motor interface', 'Display (LCD) interface', 'ADC interface'] }
    ]
  },
  {
    name: 'Scientific Computing Lab',
    experiments: [
      { part: 'EXPERIMENTS', list: ['Familiarization of the computing tool', 'Familiarization of the scientific computing', 'Realization of arrays and matrices', 'Numerical integration and differentiation', 'Solution of ordinary differential equations', 'Simple data visualization', 'Coin toss and level crossing problem', 'Convergence of Fourier series'] }
    ]
  },
  { name: 'Maintenance and Service Room' },
  { name: 'Museum (Dept. of ECE)' },
  { name: 'E-Waste Facility (Dept. of ECE)' }
];

export default function DiplomaECEPage() {
  const data = departmentsData["diploma-electronics-communication"];
  
  // Mapping the static document faculty to the central database if they exist
  const eceFaculty = DOC_FACULTY.map(docF => {
    // Attempt to find them in central data (ignoring case and title differences somewhat)
    const centralF = facultyData.find(f => 
      f.name.toLowerCase().includes(docF.name.toLowerCase().replace('dr. ', '').replace('mrs. ', '').replace('mr. ', '').trim())
    );
    return {
      name: docF.name,
      designation: docF.designation,
      qualification: docF.qualification,
      slug: centralF?.slug,
      image_url: centralF?.image_url
    };
  });

  return (
    <div className="relative bg-white min-h-screen pt-20">
      {/* Department Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-slate-50 -z-10"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm border border-primary/20">
                {data?.programme || 'Diploma'}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200">
                Duration: {data?.duration || '3 Years'}
              </div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm border border-slate-200">
                Eligibility: {data?.eligibility || 'SSLC / 10th Pass'}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6">
              {data?.name || 'Diploma in Electronics & Communication'}
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-8">
              Empowering students to innovate and create sustainable solutions for societal and global challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Vision, Mission, and About */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Department Overview</h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We aim to nurture technically skilled, ethically grounded, and globally competent professionals who contribute to socio-economic progress and technological advancement.
                </p>
              </div>

              {/* Vision and Mission */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                  <Target className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Vision</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Empowering students to innovate and create sustainable solutions for societal and global challenges. We aim to nurture technically skilled, ethically grounded, and globally competent professionals who contribute to socio-economic progress and technological advancement.
                  </p>
                </div>
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Mission</h3>
                  <ul className="text-slate-700 text-sm leading-relaxed space-y-3">
                    <li><strong>M1.</strong> To nurture a generation of Electronics and Communication engineers equipped with technical expertise, ethical values, and leadership qualities to tackle global scientific, technological, and societal challenges.</li>
                    <li><strong>M2.</strong> To establish a vibrant research ecosystem promoting innovation in advanced communication systems, embedded technologies, and sustainable electronics to address national and global needs.</li>
                    <li><strong>M3.</strong> To create an active learning environment that integrates practical exposure, interdisciplinary knowledge, and problem-solving skills, preparing students for excellence in academia, industry, and entrepreneurship.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Message from HOD */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Head of Department</h3>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                    <Users className="w-10 h-10 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">Dr. LIJI R F</h4>
                    <p className="text-primary font-bold text-sm">PROFESSOR & HOD ECE</p>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">ME, Ph.D</p>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-4"></div>
                  <p className="text-slate-500 italic text-sm">Awaiting Official HOD Message.</p>
                  <p className="text-slate-500 italic text-xs">(Awaiting Official HOD Photograph)</p>
                </div>
              </div>
              
              {/* Department Images Placeholder */}
              <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm">
                 <h3 className="text-2xl font-bold text-slate-900 mb-6">Department Gallery</h3>
                 <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                    <p className="text-slate-500 font-medium italic">Awaiting Official Department Photograph.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Educational Objectives (PEOs) */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center">
              <GraduationCap className="w-10 h-10 text-primary mr-4" />
              Program Educational Objectives
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Our PEOs define the professional and career accomplishments that the program is preparing our graduates to achieve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">01</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Technical Competence</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Graduates will demonstrate strong technical expertise in electronics, communication systems, embedded systems and related fields enabling them to design, develop, and implement innovative solutions for real-world challenges.
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">02</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Professional Ethics and Leadership</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Graduates will exhibit professional ethics, effective communication, and leadership qualities, contributing to multidisciplinary teams and excelling in their professional careers.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">03</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Entrepreneurship and Innovation</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Graduates will leverage their technical knowledge and entrepreneurial skills to establish innovative startups or contribute to technological advancements in industry and research. Graduates will address societal, environmental, and global challenges by designing sustainable and efficient electronic and communication solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratories & Facilities */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 flex items-center">
              <Wrench className="w-10 h-10 text-primary mr-4" />
              Laboratory Facilities
            </h2>
            <p className="text-lg text-slate-600">
              State-of-the-art laboratories designed to provide comprehensive hands-on experience with modern equipment, software tools, and real-world experiments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {LABS.map((lab, idx) => (
              <LabAccordion key={idx} lab={lab} />
            ))}
          </div>
        </div>
      </section>

      {/* Laboratory Rules & Library */}
      <section className="py-16 md:py-24 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Do's */}
            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mr-3" />
                Laboratory Do's
              </h3>
              <ul className="space-y-4 text-emerald-800 text-sm font-medium">
                <li className="flex items-start">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">1</span>
                  Read and understand how to carry out an activity thoroughly before coming to the lab.
                </li>
                <li className="flex items-start">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">2</span>
                  Turn off the equipments and computers accordingly after use.
                </li>
                <li className="flex items-start">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">3</span>
                  Switch off all power supplies before leaving the lab.
                </li>
                <li className="flex items-start">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">4</span>
                  Report any broken plugs or exposed electrical wires to the staff immediately.
                </li>
                <li className="flex items-start">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">5</span>
                  Be responsible when using equipments, software and facilities.
                </li>
                <li className="flex items-start">
                  <span className="bg-emerald-200 text-emerald-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">6</span>
                  Facilities are strictly for educational purpose only.
                </li>
              </ul>
            </div>

            {/* Dont's */}
            <div className="bg-red-50 border border-red-100 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                Laboratory Dont's
              </h3>
              <ul className="space-y-4 text-red-800 text-sm font-medium">
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">1</span>
                  Students are prohibited to enter the lab unless authorised by the staff.
                </li>
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">2</span>
                  Don’t attempt to repair with lab equipments.
                </li>
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">3</span>
                  Don’t move any equipment from its original position.
                </li>
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">4</span>
                  Don’t removes or load any software into the computer.
                </li>
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">5</span>
                  Don’t bring bag, food or drinks into the lab.
                </li>
                <li className="flex items-start">
                  <span className="bg-red-200 text-red-800 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 text-xs">6</span>
                  Don’t misbehave in the lab.
                </li>
              </ul>
            </div>

            {/* Library Mention */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookMarked className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">ECE Department Library</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  The department houses an exclusive technical library containing reference materials, practical manuals, and technical journals dedicated to Electronics & Communication Engineering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center">
              <Users className="w-8 h-8 text-primary mr-3" />
              Faculty Members
            </h2>
            <p className="text-lg text-slate-600">
              Learn from experienced academicians, researchers, and industry experts dedicated to student success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {eceFaculty.map((faculty, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 text-center hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-slate-50 shadow-sm bg-slate-100">
                  {faculty.image_url ? (
                    <Image 
                      src={faculty.image_url} 
                      alt={faculty.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-3xl">
                      {faculty.name.replace('Dr. ', '').replace('Mrs. ', '').replace('Mr. ', '').charAt(0)}
                    </div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{faculty.name}</h3>
                  <p className="text-xs text-primary font-bold mb-2 uppercase tracking-wide">{faculty.designation}</p>
                  <p className="text-xs text-slate-500 mb-4 font-medium uppercase">{faculty.qualification}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {faculty.slug ? (
                    <Link 
                      href={`/academics/faculty/${faculty.slug}`}
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-colors"
                    >
                      View Profile
                    </Link>
                  ) : (
                    <span className="inline-flex items-center justify-center w-full px-4 py-2 bg-slate-50 border border-slate-200 text-slate-400 text-sm font-medium rounded-xl">
                      Profile Unavailable
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Technical Staff */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-200 pb-4">Technical Staff</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TECHNICAL_STAFF.map((staff, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                    {staff.name.replace('Mrs. ', '').replace('Mr. ', '').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{staff.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{staff.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers & Partnerships Section (Placeholders) */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Placement Record */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <TrendingUp className="w-8 h-8 text-primary mr-3" />
                Placement Record
              </h2>
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <Briefcase className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-lg text-slate-500 italic">
                    Awaiting Department Placement Data.
                  </p>
                </div>
              </div>
            </div>

            {/* Industry Partners & MoUs */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center">
                <Building2 className="w-8 h-8 text-primary mr-3" />
                Industry Partners & MoUs
              </h2>
              <div className="bg-slate-50 p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <Globe className="w-12 h-12 text-slate-300 mb-4" />
                  <p className="text-lg text-slate-500 italic">
                    Awaiting Official Department Information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
