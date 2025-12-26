import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

const initialTasks: Task[] = [
  { id: "1", title: "完成2套数学卷并做错题闭环", priority: "must", status: "in-progress", hours: 4 },
  { id: "2", title: "写作2篇英语议论文", priority: "must", status: "pending", hours: 3 },
  { id: "3", title: "语料库新增20句并复用到一篇作文", priority: "must", status: "pending", hours: 1.5 },
  { id: "4", title: "历史专题框架整理", priority: "should", status: "pending", hours: 2 },
  { id: "5", title: "政治时政热点收集与分析", priority: "should", status: "completed", hours: 1 },
  { id: "6", title: "物理实验报告整理", priority: "could", status: "pending", hours: 1.5 },
];

const initialObjectives: Objective[] = [
  {
    id: "1",
    title: "英语写作能力跃迁",
    description: "从能写升级为能稳定高分写",
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

const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(" ");

function Progress({ value, max = 100, size = "md" }: { value: number; max?: number; size?: "sm" | "md" }) {
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "100%", backgroundColor: "#f3f4f6", borderRadius: "9999px", overflow: "hidden", height: size === "sm" ? "6px" : "10px" }}>
      <motion.div
        style={{ height: "100%", background: "linear-gradient(to right, #0047AB, #2a4fff)", borderRadius: "9999px" }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8 }}
      />
    </div>
  );
}

function CircularProgress({ value, size = 80 }: { value: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
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
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>{value}%</span>
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, { bg: string; color: string }> = {
    must: { bg: "#fee2e2", color: "#b91c1c" },
    should: { bg: "#fef3c7", color: "#b45309" },
    could: { bg: "#dbeafe", color: "#1d4ed8" },
    wont: { bg: "#f3f4f6", color: "#6b7280" },
  };
  const labels: Record<Priority, string> = { must: "Must", should: "Should", could: "Could", wont: "Wont" };
  return (
    <span style={{ padding: "2px 8px", borderRadius: "9999px", fontSize: "12px", fontWeight: 500, backgroundColor: styles[priority].bg, color: styles[priority].color }}>
      {labels[priority]}
    </span>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #f3f4f6", ...style }}>
      {children}
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{title}</p>
          <motion.p style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: "4px 0" }} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
            {value}
          </motion.p>
          {subtitle && <p style={{ fontSize: "14px", color: "#9ca3af", margin: 0 }}>{subtitle}</p>}
        </div>
        <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function Dashboard({ tasks, objectives, kpis, onToggleTask }: { tasks: Task[]; objectives: Objective[]; kpis: KPI[]; onToggleTask: (id: string) => void }) {
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionRate = tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0;
  const mustTasks = tasks.filter((t) => t.priority === "must");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
        <StatCard title="完成率" value={`${completionRate}%`} subtitle="本周任务" icon="✅" />
        <StatCard title="进行中目标" value={objectives.length} subtitle="个 OKR" icon="🎯" />
        <StatCard title="健康指数" value="75%" subtitle="系统状态" icon="💚" />
        <StatCard title="Must 任务" value={`${mustTasks.filter((t) => t.status === "completed").length}/${mustTasks.length}`} subtitle="已完成" icon="🔥" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <Card>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>📎 目标与关键结果</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {objectives.map((obj, idx) => (
              <motion.div key={obj.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "12px", fontFamily: "monospace", backgroundColor: "#dbeafe", color: "#1d4ed8", padding: "2px 8px", borderRadius: "4px" }}>O{idx + 1}</span>
                      <h4 style={{ fontWeight: 600, margin: 0 }}>{obj.title}</h4>
                    </div>
                    <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>{obj.description}</p>
                  </div>
                  <CircularProgress value={obj.progress} size={60} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {obj.keyResults.map((kr, krIdx) => (
                    <div key={kr.id} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                      <span style={{ fontSize: "12px", color: "#9ca3af", width: "32px" }}>KR{krIdx + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ color: "#374151" }}>{kr.title}</span>
                          <span style={{ color: "#6b7280", fontSize: "12px" }}>{kr.current}/{kr.target}</span>
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

        <Card>
          <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>📊 KPI 看板</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {kpis.map((kpi, idx) => (
              <motion.div key={kpi.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#374151" }}>{kpi.name}</span>
                  <span style={{ fontSize: "14px", color: "#6b7280" }}>{kpi.current}/{kpi.target}</span>
                </div>
                <Progress value={kpi.current} max={kpi.target} size="sm" />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>✅ 本周任务</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {tasks.map((task, idx) => (
            <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", cursor: "pointer" }}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleTask(task.id)}
                style={{ width: "20px", height: "20px", borderRadius: "50%", border: task.status === "completed" ? "none" : "2px solid #d1d5db", backgroundColor: task.status === "completed" ? "#10b981" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                {task.status === "completed" && <span style={{ color: "white", fontSize: "12px" }}>✓</span>}
              </motion.button>
              <span style={{ flex: 1, fontSize: "14px", color: task.status === "completed" ? "#9ca3af" : "#374151", textDecoration: task.status === "completed" ? "line-through" : "none" }}>{task.title}</span>
              <PriorityBadge priority={task.priority} />
              {task.hours && <span style={{ fontSize: "12px", color: "#9ca3af" }}>⏱ {task.hours}h</span>}
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Structure() {
  const cycles = [
    { name: "周度冲刺", duration: "45-60分钟", outputs: ["周OKR、周计划", "风险清单", "周复盘结论"] },
    { name: "月度业务回顾", duration: "90分钟", outputs: ["月度复盘报告", "指标看板更新", "下月策略调整"] },
    { name: "阶段里程碑", duration: "120分钟", outputs: ["里程碑验收", "关键路径调整", "资源再配置"] },
    { name: "学期战略复盘", duration: "2-3小时", outputs: ["学期OKR结案", "能力资产沉淀", "下学期战略草案"] },
    { name: "年度战略评审", duration: "半天", outputs: ["年度复盘白皮书", "下一年度北极星与主题"] },
  ];

  const methods = [
    { name: "OKR", desc: "管理跃迁与结果", use: "需要产出可验证的成果" },
    { name: "KPI", desc: "管理系统健康与稳定", use: "需要长期保持稳定" },
    { name: "MoSCoW", desc: "优先级分类框架", use: "每周任务排布" },
    { name: "5R复盘", desc: "Result-Review-Reason-Rule-Renew", use: "周/月/学期复盘" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <Card>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>📅 五周期会议制</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {cycles.map((cycle, idx) => (
            <motion.div key={cycle.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: "16px", borderRadius: "12px", background: "linear-gradient(to right, #eff6ff, white)", border: "1px solid #dbeafe" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <h4 style={{ fontWeight: 600, color: "#0047AB", margin: 0 }}>{cycle.name}</h4>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>⏱ {cycle.duration}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {cycle.outputs.map((output) => (
                  <span key={output} style={{ fontSize: "12px", padding: "4px 8px", backgroundColor: "white", borderRadius: "9999px", color: "#4b5563", border: "1px solid #e5e7eb" }}>{output}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>🧰 方法论组合</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {methods.map((method, idx) => (
            <motion.div key={method.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ scale: 1.02 }} style={{ padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", cursor: "pointer" }}>
              <div style={{ marginBottom: "8px" }}>
                <span style={{ padding: "2px 8px", backgroundColor: "#dbeafe", color: "#1d4ed8", borderRadius: "9999px", fontSize: "12px", fontWeight: 500 }}>{method.name}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "8px" }}>{method.desc}</p>
              <p style={{ fontSize: "12px", color: "#9ca3af" }}>适用：{method.use}</p>
            </motion.div>
          ))}
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Card style={{ borderLeft: "4px solid #0047AB" }}>
          <h4 style={{ fontWeight: 600, marginBottom: "8px" }}>📌 MVD</h4>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>Minimum Viable Deliverable - 最小可验收交付物。本周期内必须产出的最小可验收成果。</p>
        </Card>
        <Card style={{ borderLeft: "4px solid #10b981" }}>
          <h4 style={{ fontWeight: 600, marginBottom: "8px" }}>✅ DoD</h4>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>Definition of Done - 验收条件清单。写清做到什么程度才算完成。</p>
        </Card>
      </div>
    </div>
  );
}

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
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <Card>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>完成率</p>
          <CircularProgress value={completionRate} />
        </Card>
        <Card>
          <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>任务分布</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}><div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#10b981" }} /><span>已完成: {completedTasks}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}><div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#3b82f6" }} /><span>进行中: {tasks.filter((t) => t.status === "in-progress").length}</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}><div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#d1d5db" }} /><span>待处理: {tasks.filter((t) => t.status === "pending").length}</span></div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "16px" }}>💡 复盘提问清单</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {questions.map((q, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} style={{ padding: "16px", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <span style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#dbeafe", color: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 500, flexShrink: 0 }}>{idx + 1}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: "#1f2937", marginBottom: "8px" }}>{q}</p>
                  <textarea placeholder="在此输入你的思考..." style={{ width: "100%", padding: "8px 12px", fontSize: "14px", backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", resize: "none", outline: "none" }} rows={2} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

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
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: "56px", backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid #f3f4f6", zIndex: 50 }}>
        <div style={{ height: "100%", maxWidth: "1024px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #0047AB, #2a4fff)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontSize: "14px" }}>🧭</span>
            </div>
            <span style={{ fontWeight: 600, color: "#111827" }}>战略计划</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px", backgroundColor: "#f3f4f6", borderRadius: "12px" }}>
            {navItems.map((item) => (
              <motion.button key={item.id} whileTap={{ scale: 0.98 }} onClick={() => setPage(item.id)} style={{ padding: "6px 12px", borderRadius: "8px", fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px", border: "none", cursor: "pointer", backgroundColor: page === item.id ? "white" : "transparent", color: page === item.id ? "#0047AB" : "#4b5563", boxShadow: page === item.id ? "0 1px 2px rgba(0,0,0,0.05)" : "none" }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: "56px", paddingBottom: "32px" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", padding: "24px 16px" }}>
          <AnimatePresence mode="wait">
            <motion.div key={page} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              {page === "dashboard" && <Dashboard tasks={tasks} objectives={initialObjectives} kpis={initialKPIs} onToggleTask={toggleTask} />}
              {page === "structure" && <Structure />}
              {page === "analytics" && <Analytics tasks={tasks} kpis={initialKPIs} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer style={{ backgroundColor: "white", borderTop: "1px solid #f3f4f6", padding: "16px" }}>
        <div style={{ maxWidth: "1024px", margin: "0 auto", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          战略计划系统 | 五周期管理：周度 · 月度 · 半学期 · 学期 · 年度
        </div>
      </footer>
    </div>
  );
}
