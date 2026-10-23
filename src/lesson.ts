import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 59,
  title: "Applied Agents: Retrieval, Analysis, Documents and Review",
  description: "The earlier lessons gave us reusable primitives: explicit resources, scoped tools, durable state, typed reports, and independent gates. Now apply them to retrieval, data analysis, document generation, and pull-request review.",
  concepts: ["Bind PR findings to the current head", "Validate changed-line locations", "Prepare findings without publishing"],
  scope: "Validates a local PR-review report against a seeded diff manifest. It does not fetch a repository, post a comment, or verify the finding is true. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Prepare a current scoped finding", "input": {"head": "head-1", "currentHead": "head-1", "path": "src/api.ts", "line": 12}, "expected": "passed", "checks": {"prepared": true}}, {"id": "1", "label": "Reject a stale PR head", "input": {"head": "head-1", "currentHead": "head-2", "path": "src/api.ts", "line": 12}, "expected": "conflict", "checks": {"prepared": false}}, {"id": "2", "label": "Reject a finding outside the diff", "input": {"head": "head-1", "currentHead": "head-1", "path": "secrets.env", "line": 1}, "expected": "rejected", "checks": {"prepared": false}}],
  async run(input) {

if(text(input,"head")!==text(input,"currentHead"))return report("conflict","The PR revision changed after review",{prepared:false},["Recheck the current repository head"]);
const path=text(input,"path"),line=number(input,"line"),valid=path==="src/api.ts"&&[11,12,13].includes(line);
return report(valid?"passed":"rejected",valid?"Prepared a diff-scoped report for human review":"Finding location is outside the reviewed diff",{prepared:valid,finding:valid?{path,line,severity:"medium",message:"Demonstration finding; independently review."}:null,diffHash:hash("reviewed diff bytes"),published:false},["Bind exact reviewed input bytes","Validate schema and changed-line map","Reject a stale revision","Keep publication separately authorized"]);

  }
};
