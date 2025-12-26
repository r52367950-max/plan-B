import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ============== 类型定义 ==============
type Priority = "must" | "should" | "could" | "wont";
type TaskStatus = "pending" | "in-progress" | "completed";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: TaskStatus;
  hours?: number;
}

interface Objective {
  id: string;
  title: string;
  description: string;
  progress: number;
  keyResults: { id: string; title: string; current: number; target: number }[];
}

interface KPI {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
}

// ============== 初始数据 ==============
const initialTasks: Task[] = [
  { id: "1", title: "完成2套数学卷并做错题闭环", priority: "must", status: "in-progress", hours: 4 },
  { id: "2", title: "写作2篇英语议论文（初稿+修改稿）", priority: "must", status: "pending", hours: 3 },
  { id: "3", title: "语料库新增20句并复用到一篇作文", priority: "must", status: "pending", hours: 1.5 },
  { id: "4", title: "历史专题框架整理", priority: "should", status: "pending", hours: 2 },
  { id: "5", title: "政治时政热点收集与分析", priority: "should", status: "completed", hours: 1 },
  { id: "6", title: "物理实验报告整理", priority: "could", status: "pending", hours: 1.5 },
];

const initialObjectives: Objective[] = [
  {
    id: "1",
    title: "英语写作能力跃迁",
    description: "从"能写"升级为"能稳定高分写"",
    progress: 45,
    keyResults: [
      { id: "kr1", title: "完成12篇议论文", current: 5, target: 12 },
      { id: "kr2", title: "建立论证模板库", current: 4, target: 10 },
      { id: "kr3", title: "形成语料库", current: 85, target: 200 },
    ],
  },
  {
    id: "2",
    title: "数学解题方法体系化",
    description: "建立可复用的数学方法论资产",
    progress: 32,
    keyResults: [
      { id: "kr4", title: "题型方法论文档", current: 3, target: 8 },
      { id: "kr5", title: "错题闭环率", current: 62, target: 85 },
    ],
  },
];

const initialKPIs: KPI[] = [
  { id: "1", name: "有效学习时长", current: 28, target: 35, unit: "小时/周" },
  { id: "2", name: "错题闭环率", current: 72, target: 85, unit: "%" },
  { id: "3", name: "计划完成率", current: 78, target: 90, unit: "%" },
  { id: "4", name: "睡眠达标率", current: 71, target: 85, unit: "%" },
  { id: "5", name: "深度工作块", current: 15, target: 20, unit: "块/周" },
];
// ============== 工具函数 ==============
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

// ============== 组件 ==============

// 进度条
function Progress({ value, max = 100, size = "md" }: { value: number; max?: number; size?: "sm" | "md" }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={cn("w-full bg-gray-100 rounded-full overflow-hidden", size === "sm" ? "h-1.5" : "h-2.5")}>
      <motion.div
        className="h-full bg-gradient-to-r from-[#0047AB] to-[#2a4fff] rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}

// 圆形进度
function CircularProgress({ value, size = 80 }: { value: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0047AB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{value}%</span>
      </div>
    </div>
  );
}

// 优先级标签
function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    must: "bg-red-100 text-red-700",
    should: "bg-amber-100 text-amber-700",
    could: "bg-blue-100 text-blue-700",
    wont: "bg-gray-100 text-gray-500",
  };
  const labels: Record<Priority, string> = { must: "Must", should: "Should", could: "Could", wont: "Won't" };
  return <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", styles[priority])}>{labels[priority]}</span>;
}

// 卡片
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("bg-white rounded-2xl p-6 shadow-sm border border-gray-100", className)}>{children}</div>;
}

// 统计卡片
function StatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <motion.p className="text-3xl font-bold text-gray-900 mt-1" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
            {value}
          </motion.p>
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">{icon}</div>
      </div>
    </Card>
  );
}
// ============== 页面组件 ==============

// Dashboard 页面
function Dashboard({ tasks, objectives, kpis, onToggleTask }: { tasks: Task[]; objectives: Objective[]; kpis: KPI[]; onToggleTask: (id: string) => void }) {
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const mustTasks = tasks.filter((t) => t.priority === "must");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="完成率" value={`${completionRate}%`} subtitle="本周任务" icon="✅" />
        <StatCard title="进行中目标" value={objectives.length} subtitle="个 OKR" icon="🎯" />
        <StatCard title="健康指数" value="75%" subtitle="系统状态" icon="💚" />
        <StatCard title="Must 任务" value={`${mustTasks.filter((t) => t.status === "completed").length}/${mustTasks.length}`} subtitle="已完成" icon="🔥" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold mb-4">📎 目标与关键结果</h3>
            <div className="space-y-4">
              {objectives.map((obj, idx) => (
                <motion.div key={obj.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-blue-100 text-blue-700 px-2 py-0.5 rounded">O{idx + 1}</span>
                        <h4 className="font-semibold">{obj.title}</h4>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{obj.description}</p>
                    </div>
                    <CircularProgress value={obj.progress} size={60} />
                  </div>
                  <div className="space-y-2">
                    {obj.keyResults.map((kr, krIdx) => (
                      <div key={kr.id} className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-gray-400 w-8">KR{krIdx + 1}</span>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-700 truncate">{kr.title}</span>
                            <span className="text-gray-500 text-xs">{kr.current}/{kr.target}</span>
                          </div>
                          <Progress value={kr.current} max={kr.target} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h3 className="text-lg font-semibold mb-4">📊 KPI 看板</h3>
            <div className="space-y-4">
              {kpis.map((kpi, idx) => (
                <motion.div key={kpi.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{kpi.name}</span>
                    <span className="text-sm text-gray-500">{kpi.current}/{kpi.target} {kpi.unit}</span>
                  </div>
                  <Progress value={kpi.current} max={kpi.target} size="sm" />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">✅ 本周任务</h3>
        <div className="space-y-2">
          {tasks.map((task, idx) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleTask(task.id)}
                className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", task.status === "completed" ? "bg-emerald-500 border-emerald-500" : "border-gray-300 group-hover:border-blue-400")}
              >
                {task.status === "completed" && <span className="text-white text-xs">✓</span>}
              </motion.button>
              <span className={cn("flex-1 text-sm", task.status === "completed" && "text-gray-400 line-through")}>{task.title}</span>
              <PriorityBadge priority={task.priority} />
              {task.hours && <span className="text-xs text-gray-400">⏱ {task.hours}h</span>}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
// 计划结构页面
function Structure() {
  const cycles = [
    { name: "周度冲刺", duration: "45-60分钟", outputs: ["周 OKR、周计划", "风险清单", "周复盘结论"] },
    { name: "月度业务回顾", duration: "90分钟", outputs: ["月度复盘报告", "指标看板更新", "下月策略调整"] },
    { name: "阶段里程碑", duration: "120分钟", outputs: ["里程碑验收", "关键路径调整", "资源再配置"] },
    { name: "学期战略复盘", duration: "2-3小时", outputs: ["学期OKR结案", "能力资产沉淀", "下学期战略草案"] },
    { name: "年度战略评审", duration: "半天", outputs: ["年度复盘白皮书", "下一年度北极星与主题"] },
  ];

  const methods = [
    { name: "OKR", desc: "管理跃迁与结果", use: "需要产出可验证的成果" },
    { name: "KPI", desc: "管理系统健康与稳定", use: "需要长期保持稳定" },
    { name: "MoSCoW", desc: "优先级分类框架", use: "每周任务排布" },
    { name: "5R复盘", desc: "Result→Review→Reason→Rule→Renew", use: "周/月/学期复盘" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold mb-4">📅 五周期会议制</h3>
        <div className="space-y-3">
          {cycles.map((cycle, idx) => (
            <motion.div key={cycle.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-white border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[#0047AB]">{cycle.name}</h4>
                <span className="text-sm text-gray-500">⏱ {cycle.duration}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cycle.outputs.map((output) => (
                  <span key={output} className="text-xs px-2 py-1 bg-white rounded-full text-gray-600 border">{output}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold mb-4">🧰 方法论组合</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((method, idx) => (
            <motion.div key={method.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.02 }} className="p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{method.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{method.desc}</p>
              <p className="text-xs text-gray-400">适用：{method.use}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-[#0047AB]">
          <h4 className="font-semibold text-gray-900 mb-2">📌 MVD</h4>
          <p className="text-sm text-gray-600">Minimum Viable Deliverable - 最小可验收交付物。本周期内必须产出的最小可验收成果。</p>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <h4 className="font-semibold text-gray-900 mb-2">✅ DoD</h4>
          <p className="text-sm text-gray-600">Definition of Done - 验收条件清单。写清"做到什么程度才算完成"。</p>
        </Card>
      </div>
    </div>
  );
}

// 复盘页面
function Analytics({ tasks, kpis }: { tasks: Task[]; kpis: KPI[] }) {
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const questions = [
    "这周期我最重要的一个成果是什么？它如何可复用？",
    "我在哪个环节消耗最大但产出最低？如何砍掉或重构？",
    "我最有效的学习策略是什么？证据是什么？",
    "哪个风险信号最早出现？下次怎样更早触发预案？",
    "下一周期我只允许自己做三件最重要的事，它们是什么？",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-gray-500">完成率</p>
          <div className="flex items-center gap-4 mt-2">
            <CircularProgress value={completionRate} />
          </div>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">任务分布</p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-emerald-500" /><span>已完成: {completedTasks}</span></div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-blue-500" /><span>进行中: {tasks.filter((t) => t.status === "in-progress").length}</span></div>
            <div className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-gray-300" /><span>待处理: {tasks.filter((t) => t.status === "pending").length}</span></div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold mb-4">💡 复盘提问清单</h3>
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-xl bg-gray-50">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium flex-shrink-0">{idx + 1}</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 mb-2">{q}</p>
                  <textarea placeholder="在此输入你的思考..." className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none" rows={2} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============== 主应用 ==============
export default function App() {
  const [page, setPage] = useState<"dashboard" | "structure" | "analytics">("dashboard");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t)));
  };

  const navItems = [
    { id: "dashboard", label: "总览", icon: "📊" },
    { id: "structure", label: "结构", icon: "🌳" },
    { id: "analytics", label: "复盘", icon: "📈" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="h-full max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0047AB] to-[#2a4fff] flex items-center justify-center">
              <span className="text-white text-sm">🧭</span>
            </div>
            <span className="font-semibold text-gray-900">战略计划</span>
          </div>
          <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
            {navItems.map((item) => (
              <motion.button key={item.id} whileTap={{ scale: 0.98 }} onClick={() => setPage(item.id)} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1", page === item.id ? "bg-white text-[#0047AB] shadow-sm" : "text-gray-600")}>
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      <main className="pt-14 pb-8">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              {page === "dashboard" && <Dashboard tasks={tasks} objectives={initialObjectives} kpis={initialKPIs} onToggleTask={toggleTask} />}
              {page === "structure" && <Structure />}
              {page === "analytics" && <Analytics tasks={tasks} kpis={initialKPIs} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-4">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-gray-500">
          战略计划系统 | 五周期管理：周度 · 月度 · 半学期 · 学期 · 年度
        </div>
      </footer>
    </div>
  );
}
