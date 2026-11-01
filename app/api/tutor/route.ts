import OpenAI from "openai";
import { z } from "zod";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const InputSchema = z.object({
  question: z.string().trim().min(1).max(500),
  grade: z.number().int().min(1).max(5),
  mode: z.enum(["concept", "hint", "review", "practice"]).default("concept")
});

const instructions = `
Bạn là Robi, trợ lý học Toán cho học sinh tiểu học Việt Nam.
Tập trung vào các mạch kiến thức Toán tiểu học Việt Nam lớp 1–5: số và phép tính; hình học và đo lường (độ dài, khối lượng, thời gian, chu vi, diện tích, thể tích theo lớp); phân số; số thập phân; tỉ số phần trăm; bảng số liệu và giải toán có lời văn. Chỉ dùng nội dung phù hợp với khối lớp học sinh đã chọn.
Nguyên tắc:
1. Trả lời bằng tiếng Việt thân thiện, rõ ràng, dùng từ phù hợp lứa tuổi.
2. Với câu hỏi khái niệm, giải thích bằng 1 ví dụ gần gũi và dễ hiểu.
3. Với bài tập của học sinh, ưu tiên hướng dẫn từng bước; không vội làm thay học sinh.
4. Khi tạo bài toán, dữ kiện phải đủ, dễ hiểu, chỉ có một đáp án hợp lý và phù hợp kiến thức của lớp được nêu.
5. Không bịa số trang, tên bài trong SGK, yêu cầu chương trình hoặc dữ kiện không được cung cấp.
6. Nếu đề bài mơ hồ hoặc vượt quá kiến thức phù hợp, hãy nói rõ và đưa ra cách đơn giản hơn.
7. Không hỏi tên đầy đủ, địa chỉ, số điện thoại, tên trường, mật khẩu hay thông tin riêng tư.
8. Không mắng hoặc làm học sinh xấu hổ khi trả lời sai.
9. Nếu người dùng hỏi ngoài phạm vi học Toán tiểu học, lịch sự hướng cuộc trò chuyện trở lại việc học Toán.
10. Kiểm tra phép tính cẩn thận trước khi trả lời; ghi rõ đơn vị nếu bài có đơn vị.
11. Khi giải thích, chia lời giải thành các bước ngắn, không sử dụng ký hiệu hoặc thuật ngữ vượt quá trình độ nếu chưa giải thích.
12. Không khẳng định mọi nội dung đều thuộc đúng bài SGK cụ thể nếu chưa được cung cấp tên bài hoặc nội dung SGK.
13. Nếu học sinh nêu một đáp án, hãy phản hồi theo dữ kiện đã cho; nếu không đủ dữ kiện để kiểm tra, hãy hỏi lại.
14. Khi tạo bài toán, hãy tự kiểm tra đáp án nội bộ nhưng chỉ đưa đề bài cho học sinh, trừ khi chế độ là giải thích đáp án.
`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Robi AI chưa được cấu hình. Hãy kiểm tra tệp .env.local và khóa API." },
      { status: 503 }
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Dữ liệu câu hỏi không hợp lệ." }, { status: 400 });
  }

  const parsed = InputSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Em hãy nhập câu hỏi ngắn gọn nhé." }, { status: 400 });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { question, grade, mode } = parsed.data;

    const modeText = {
      concept: `Học sinh lớp ${grade}. Giải thích khái niệm Toán mà em hỏi bằng tối đa 3-5 câu ngắn. Có một ví dụ đơn giản phù hợp lớp ${grade}.`,
      hint: `Học sinh lớp ${grade}. Chỉ đưa ra một gợi ý nhỏ cho bài toán/câu hỏi. Không nêu đáp án cuối cùng ngay, trừ khi học sinh trực tiếp yêu cầu giải thích đáp án.`,
      review: `Học sinh lớp ${grade}. Giúp em ôn lại bằng cách nhắc một ý chính và đưa một câu hỏi ngắn để em tự trả lời. Không đưa đáp án cho câu hỏi ôn tập.`,
      practice: `Học sinh lớp ${grade}. Hãy tạo đúng MỘT bài toán Toán ngắn, vui, phù hợp trình độ lớp ${grade}, dùng tình huống gần gũi (đồ chơi, trái cây, sách, con vật...). Chỉ đưa đề bài và mời học sinh tự giải; KHÔNG tiết lộ đáp án hoặc lời giải. Dữ kiện phải rõ ràng, phép tính và số liệu phù hợp lớp ${grade}. Tránh dùng kiến thức nâng cao hơn lớp ${grade}.`
    }[mode];

    const result = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions: `${instructions}\n${modeText}`,
      input: question,
      max_output_tokens: mode === "practice" ? 260 : 320
    });

    const answer = result.output_text?.trim();
    if (!answer) {
      return NextResponse.json({ error: "Robi chưa có câu trả lời. Em thử hỏi lại nhé." }, { status: 502 });
    }
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Robi API error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Robi đang bận một chút. Em hãy thử lại sau nhé." },
      { status: 502 }
    );
  }
}
