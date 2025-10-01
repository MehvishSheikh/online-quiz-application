import { useState } from 'react';
import { quizApi } from '@/services/api/api.service';
import { Button } from '@/components/ui/button';

export const AdminCreateQuiz = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('javascript');
  const [level, setLevel] = useState('basic');
  const [quizId, setQuizId] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [question, setQuestion] = useState({
    question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' as 'A'|'B'|'C'|'D'
  });

  const [questionList, setQuestionList] = useState<typeof question[]>([]);

  const createQuiz = async () => {
    if (!title.trim()) { setMsg('Please provide a title'); return; }
    const res = await quizApi.createQuiz({ title, description, category, level });
    setQuizId(res.id);
    setMsg('Quiz created. Adding questions...');
    // add all prepared questions
    for (const q of questionList) {
      await quizApi.addQuestion(res.id, q);
    }
    setMsg(`Quiz ready! ${questionList.length} question(s) added.`);
  };

  const addQuestion = async () => {
    setQuestionList(prev => [...prev, question]);
    setMsg('Question staged');
    setQuestion({ question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Create Quiz</h1>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <div className="grid gap-3">
          <input className="border rounded px-3 py-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
          <input className="border rounded px-3 py-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="border rounded px-3 py-2" value={category} onChange={(e)=>setCategory(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="react">React</option>
              <option value="next">Next</option>
            </select>
            <select className="border rounded px-3 py-2" value={level} onChange={(e)=>setLevel(e.target.value)}>
              <option value="basic">Basic</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          {questionList.length > 0 && (
            <div className="text-sm text-muted-foreground">Staged questions: {questionList.length}</div>
          )}
        </div>

        <div className="border-t pt-6 space-y-3">
          <h2 className="font-semibold">Add Question</h2>
          <input className="border rounded px-3 py-2" placeholder="Question text" value={question.question_text} onChange={(e)=>setQuestion({...question, question_text: e.target.value})} />
          <div className="grid grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Option A" value={question.option_a} onChange={(e)=>setQuestion({...question, option_a: e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Option B" value={question.option_b} onChange={(e)=>setQuestion({...question, option_b: e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Option C" value={question.option_c} onChange={(e)=>setQuestion({...question, option_c: e.target.value})} />
            <input className="border rounded px-3 py-2" placeholder="Option D" value={question.option_d} onChange={(e)=>setQuestion({...question, option_d: e.target.value})} />
          </div>
          <select className="border rounded px-3 py-2" value={question.correct_option} onChange={(e)=>setQuestion({...question, correct_option: e.target.value as any})}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <div className="flex gap-3">
            <Button onClick={addQuestion}>Add Question</Button>
            <Button variant="outline" onClick={()=>setQuestionList([])}>Clear Staged</Button>
          </div>
        </div>

        {/* Finalize create only after questions are staged */}
        <div className="pt-2">
          <Button disabled={questionList.length === 0} onClick={createQuiz}>
            {questionList.length === 0 ? 'Add questions to enable Create' : 'Create Quiz with Questions'}
          </Button>
        </div>
      </div>
    </div>
  );
};


