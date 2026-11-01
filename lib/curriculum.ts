export type Strand = "NUMBER" | "GEOMETRY" | "DATA";
export type Lesson = {
  id: string;
  grade: 1 | 2 | 3 | 4 | 5;
  strand: Strand;
  title: string;
  objective: string;
  summary: string;
  example: string;
  steps: string[];
  status: "sample";
};
export type Question = {
  id: string;
  grade: 1 | 2 | 3 | 4 | 5;
  strand: Strand;
  lessonId: string;
  prompt: string;
  choices: string[];
  answer: string;
  hint: string;
  explanation: string;
  difficulty: "Dễ" | "Vừa sức" | "Thử thách";
};

export const strandLabels: Record<Strand, string> = {
  NUMBER: "Số và phép tính",
  GEOMETRY: "Hình học và đo lường",
  DATA: "Một số yếu tố thống kê và xác suất"
};

export const lessons: Lesson[] = [
  { id:"g1-count", grade:1, strand:"NUMBER", title:"Đếm và đọc số", objective:"Đếm, đọc và nhận biết số trong phạm vi phù hợp với bài học.", summary:"Mỗi số biểu thị số lượng đồ vật. Ta có thể đếm lần lượt để không bỏ sót.", example:"Có 4 quả táo: một, hai, ba, bốn.", steps:["Quan sát các đồ vật.","Chỉ vào từng đồ vật khi đếm.","Đọc số lượng vừa đếm được."], status:"sample" },
  { id:"g1-shapes", grade:1, strand:"GEOMETRY", title:"Nhận biết hình phẳng", objective:"Nhận dạng một số hình phẳng quen thuộc qua đồ vật xung quanh.", summary:"Hình tròn, hình tam giác, hình vuông và hình chữ nhật có những đặc điểm khác nhau.", example:"Mặt đồng hồ thường có dạng hình tròn.", steps:["Quan sát đường bao của hình.","So sánh cạnh và góc theo hướng dẫn.","Tìm đồ vật có hình dạng tương tự."], status:"sample" },
  { id:"g1-add", grade:1, strand:"NUMBER", title:"Cộng bằng cách đếm thêm", objective:"Minh họa phép cộng bằng đồ vật hoặc tia số trong phạm vi đã học.", summary:"Cộng là gộp các nhóm hoặc đếm thêm.", example:"Có 2 khối, thêm 3 khối thì có 5 khối.", steps:["Đặt 2 khối.","Thêm 3 khối.","Đếm tất cả các khối."], status:"sample" },
  { id:"g2-add", grade:2, strand:"NUMBER", title:"Cộng có nhớ trong phạm vi 100", objective:"Thực hiện phép cộng có nhớ theo hàng đơn vị và hàng chục.", summary:"Khi tổng các đơn vị bằng 10 hoặc lớn hơn 10, ta đổi 10 đơn vị thành 1 chục rồi cộng tiếp hàng chục.", example:"27 + 15: 7 + 5 = 12 đơn vị, đổi thành 1 chục và 2 đơn vị.", steps:["Cộng hàng đơn vị.","Đổi 10 đơn vị thành 1 chục nếu cần.","Cộng hàng chục, kể cả chục nhớ.","Kiểm tra kết quả."], status:"sample" },
  { id:"g2-measure", grade:2, strand:"GEOMETRY", title:"Đo độ dài", objective:"Bước đầu sử dụng thước và đơn vị độ dài phù hợp.", summary:"Khi đo, đặt vạch 0 của thước trùng với một đầu vật cần đo.", example:"Đặt vạch 0 ở đầu bút chì rồi đọc vạch tại đầu còn lại.", steps:["Đặt thước thẳng theo vật.","Đặt vạch 0 trùng với đầu vật.","Đọc số đo tại đầu kia."], status:"sample" },
  { id:"g3-multiply", grade:3, strand:"NUMBER", title:"Phép nhân là tổng các số hạng bằng nhau", objective:"Liên hệ phép nhân với các nhóm có số lượng bằng nhau.", summary:"Phép nhân có thể biểu thị tổng của các số hạng bằng nhau.", example:"3 nhóm, mỗi nhóm 4 ngôi sao: 4 + 4 + 4 = 4 × 3 = 12.", steps:["Đếm số nhóm.","Đếm số vật trong mỗi nhóm.","Viết phép nhân tương ứng."], status:"sample" },
  { id:"g3-area", grade:3, strand:"GEOMETRY", title:"Diện tích hình chữ nhật", objective:"Nhận biết diện tích qua số ô vuông đơn vị và giải bài tập phù hợp.", summary:"Có thể đo diện tích bằng cách đếm các ô vuông đơn vị phủ kín hình.", example:"Hình có 3 hàng, mỗi hàng 4 ô vuông thì có 12 ô vuông đơn vị.", steps:["Xác định số hàng ô vuông.","Đếm số ô trong mỗi hàng.","Tìm tổng số ô vuông đơn vị."], status:"sample" },
  { id:"g3-data", grade:3, strand:"DATA", title:"Đọc bảng số liệu đơn giản", objective:"Đọc và trả lời câu hỏi dựa trên bảng số liệu đơn giản.", summary:"Bảng số liệu sắp xếp thông tin thành hàng và cột để dễ quan sát.", example:"Quan sát số bạn thích từng loại quả rồi tìm loại được nhiều bạn chọn nhất.", steps:["Đọc tên các hàng hoặc cột.","Tìm số liệu cần thiết.","So sánh và trả lời câu hỏi."], status:"sample" },
  { id:"g4-fraction", grade:4, strand:"NUMBER", title:"Phân số qua hình ảnh", objective:"Nhận biết phân số qua các phần bằng nhau của một đơn vị.", summary:"Mẫu số cho biết đơn vị được chia thành bao nhiêu phần bằng nhau; tử số cho biết số phần được xét.", example:"Tô 3 trong 4 phần bằng nhau biểu thị 3/4.", steps:["Chia hình thành các phần bằng nhau.","Đếm tổng số phần để xác định mẫu số.","Đếm số phần được tô để xác định tử số."], status:"sample" },
  { id:"g4-angles", grade:4, strand:"GEOMETRY", title:"Nhận biết góc", objective:"Nhận biết góc nhọn, góc vuông, góc tù theo kiến thức đã học.", summary:"Góc vuông có số đo 90°. Góc nhọn nhỏ hơn góc vuông; góc tù lớn hơn góc vuông và nhỏ hơn góc bẹt.", example:"Góc có số đo 45° là góc nhọn.", steps:["Xác định đỉnh và hai cạnh của góc.","So sánh với góc vuông.","Gọi tên loại góc."], status:"sample" },
  { id:"g4-chart", grade:4, strand:"DATA", title:"Đọc biểu đồ cột", objective:"Đọc thông tin và so sánh số liệu từ biểu đồ cột đơn giản.", summary:"Chiều cao cột biểu thị giá trị dữ liệu; cần đọc tên biểu đồ và đơn vị trước khi so sánh.", example:"Cột cao hơn biểu thị số lượng lớn hơn khi cùng một thang đo.", steps:["Đọc tiêu đề và chú giải.","Xem thang chia trên trục.","Đọc giá trị các cột và so sánh."], status:"sample" },
  { id:"g5-decimal", grade:5, strand:"NUMBER", title:"Số thập phân", objective:"Đọc, viết và biểu diễn số thập phân theo hàng.", summary:"Các chữ số bên phải dấu phẩy biểu thị phần mười, phần trăm, phần nghìn... theo vị trí.", example:"0,5 biểu thị năm phần mười, có thể viết là 5/10.", steps:["Xác định phần nguyên và phần thập phân.","Đọc chữ số theo hàng.","Kiểm tra vị trí dấu phẩy."], status:"sample" },
  { id:"g5-percent", grade:5, strand:"NUMBER", title:"Tỉ số phần trăm", objective:"Hiểu phần trăm là cách biểu thị số phần trong 100 phần bằng nhau.", summary:"Kí hiệu % có nghĩa là phần trăm, tức là trên 100.", example:"25% biểu thị 25 phần trong 100 phần bằng nhau.", steps:["Xác định tổng số phần bằng nhau.","Xác định số phần được xét.","Biểu thị số phần trên 100 khi phù hợp."], status:"sample" },
  { id:"g5-volume", grade:5, strand:"GEOMETRY", title:"Thể tích qua khối lập phương đơn vị", objective:"Hiểu thể tích qua số khối đơn vị xếp kín một vật thể.", summary:"Thể tích biểu thị phần không gian mà hình khối chiếm chỗ; có thể minh họa bằng các khối lập phương đơn vị.", example:"Xếp các khối lập phương đơn vị thành lớp rồi đếm số khối.", steps:["Quan sát cách xếp các khối.","Đếm số khối trong một lớp.","Đếm số lớp và tổng số khối."], status:"sample" }
];

export const questions: Question[] = [
  { id:"q-g1-1", grade:1, strand:"NUMBER", lessonId:"g1-count", prompt:"Có 3 quả táo, thêm 1 quả táo. Có tất cả bao nhiêu quả?", choices:["2","3","4","5"], answer:"4", hint:"Hãy đếm tiếp sau số 3 một bước.", explanation:"3 quả thêm 1 quả là 4 quả.", difficulty:"Dễ" },
  { id:"q-g1-2", grade:1, strand:"GEOMETRY", lessonId:"g1-shapes", prompt:"Mặt đồng hồ tròn thường có dạng hình gì?", choices:["Hình tam giác","Hình tròn","Hình chữ nhật","Hình vuông"], answer:"Hình tròn", hint:"Hãy nhìn đường bao cong khép kín của mặt đồng hồ.", explanation:"Mặt đồng hồ trong ví dụ có dạng hình tròn.", difficulty:"Dễ" },
  { id:"q-g2-1", grade:2, strand:"NUMBER", lessonId:"g2-add", prompt:"27 + 15 = ?", choices:["32","42","43","52"], answer:"42", hint:"Cộng hàng đơn vị trước: 7 + 5 bằng bao nhiêu? Có thể đổi 10 đơn vị thành 1 chục.", explanation:"7 + 5 = 12, viết 2 đơn vị và nhớ 1 chục. Hàng chục: 2 + 1 + 1 = 4. Kết quả là 42.", difficulty:"Vừa sức" },
  { id:"q-g2-2", grade:2, strand:"GEOMETRY", lessonId:"g2-measure", prompt:"Khi đo một chiếc bút bằng thước, ta nên đặt đầu bút ở đâu?", choices:["Vạch 0 của thước","Vạch 5 của thước","Cuối thước bất kỳ","Giữa thước"], answer:"Vạch 0 của thước", hint:"Hãy tìm vạch bắt đầu dùng để đo.", explanation:"Đặt vạch 0 trùng với một đầu vật giúp đọc đúng độ dài.", difficulty:"Dễ" },
  { id:"q-g3-1", grade:3, strand:"NUMBER", lessonId:"g3-multiply", prompt:"Có 4 nhóm, mỗi nhóm 3 bông hoa. Phép tính nào biểu thị số bông hoa?", choices:["4 + 3","3 × 4","4 - 3","4 ÷ 3"], answer:"3 × 4", hint:"Có 4 nhóm bằng nhau, mỗi nhóm có 3 bông.", explanation:"Lấy 3 bông ở mỗi nhóm, lặp lại 4 nhóm: 3 × 4 = 12.", difficulty:"Vừa sức" },
  { id:"q-g3-2", grade:3, strand:"DATA", lessonId:"g3-data", prompt:"Bảng số liệu cho biết 8 bạn thích táo, 5 bạn thích lê. Loại quả nào được nhiều bạn thích hơn?", choices:["Lê","Táo","Bằng nhau","Không thể biết"], answer:"Táo", hint:"So sánh 8 và 5.", explanation:"8 lớn hơn 5 nên trong ví dụ này có nhiều bạn thích táo hơn.", difficulty:"Dễ" },
  { id:"q-g4-1", grade:4, strand:"NUMBER", lessonId:"g4-fraction", prompt:"Một hình được chia thành 4 phần bằng nhau, tô 3 phần. Phân số biểu thị phần tô là gì?", choices:["1/4","3/4","4/3","3/3"], answer:"3/4", hint:"Mẫu số là tổng số phần bằng nhau; tử số là số phần được tô.", explanation:"Có 4 phần bằng nhau và tô 3 phần nên phân số là 3/4.", difficulty:"Vừa sức" },
  { id:"q-g4-2", grade:4, strand:"GEOMETRY", lessonId:"g4-angles", prompt:"Góc có số đo 45° là góc gì?", choices:["Góc tù","Góc bẹt","Góc vuông","Góc nhọn"], answer:"Góc nhọn", hint:"Góc vuông bằng 90°. 45° nhỏ hơn 90°.", explanation:"Góc nhọn có số đo nhỏ hơn 90°.", difficulty:"Dễ" },
  { id:"q-g5-1", grade:5, strand:"NUMBER", lessonId:"g5-decimal", prompt:"0,5 viết dưới dạng phân số thập phân là gì?", choices:["5/100","5/10","50/1000","1/5"], answer:"5/10", hint:"Chữ số 5 nằm ở hàng phần mười.", explanation:"0,5 biểu thị năm phần mười nên viết dưới dạng phân số thập phân là 5/10.", difficulty:"Vừa sức" },
  { id:"q-g5-2", grade:5, strand:"NUMBER", lessonId:"g5-percent", prompt:"25% có nghĩa là bao nhiêu phần trong 100 phần bằng nhau?", choices:["2","15","25","75"], answer:"25", hint:"Kí hiệu phần trăm có nghĩa là trên 100.", explanation:"25% biểu thị 25 phần trong 100 phần bằng nhau.", difficulty:"Dễ" },

  // Bộ câu hỏi bổ sung theo 3 mức độ: Dễ, Vừa sức, Thử thách.
  { id:"q-g1-3", grade:1, strand:"NUMBER", lessonId:"g1-add", prompt:"5 + 2 = ?", choices:["6","7","8","9"], answer:"7", hint:"Đếm tiếp 2 số sau số 5.", explanation:"5 thêm 2 là 7.", difficulty:"Dễ" },
  { id:"q-g1-4", grade:1, strand:"NUMBER", lessonId:"g1-count", prompt:"Số nào lớn hơn 6?", choices:["4","5","7","3"], answer:"7", hint:"Đếm các số và tìm số đứng sau 6.", explanation:"7 lớn hơn 6 một đơn vị.", difficulty:"Dễ" },
  { id:"q-g1-5", grade:1, strand:"NUMBER", lessonId:"g1-add", prompt:"Có 9 chiếc kẹo, ăn 3 chiếc. Còn lại bao nhiêu chiếc?", choices:["6","7","5","12"], answer:"6", hint:"Số kẹo giảm đi nên con hãy trừ.", explanation:"9 − 3 = 6 chiếc kẹo.", difficulty:"Vừa sức" },
  { id:"q-g1-6", grade:1, strand:"GEOMETRY", lessonId:"g1-shapes", prompt:"Hình nào có 3 cạnh?", choices:["Hình tròn","Hình tam giác","Hình vuông","Hình chữ nhật"], answer:"Hình tam giác", hint:"Đếm số cạnh thẳng của từng hình.", explanation:"Hình tam giác có 3 cạnh.", difficulty:"Thử thách" },
  { id:"q-g2-3", grade:2, strand:"NUMBER", lessonId:"g2-add", prompt:"36 + 23 = ?", choices:["49","59","69","58"], answer:"59", hint:"Cộng hàng đơn vị rồi đến hàng chục.", explanation:"6 + 3 = 9; 3 chục + 2 chục = 5 chục. Kết quả 59.", difficulty:"Dễ" },
  { id:"q-g2-4", grade:2, strand:"NUMBER", lessonId:"g2-add", prompt:"70 − 28 = ?", choices:["42","52","48","62"], answer:"42", hint:"Có thể tách 28 thành 20 và 8.", explanation:"70 − 20 = 50; 50 − 8 = 42.", difficulty:"Vừa sức" },
  { id:"q-g2-5", grade:2, strand:"NUMBER", lessonId:"g2-add", prompt:"Mai có 28 nhãn vở, được thêm 17 nhãn. Mai có tất cả bao nhiêu nhãn?", choices:["35","45","44","55"], answer:"45", hint:"Bài toán thêm vào thường dùng phép cộng.", explanation:"28 + 17 = 45 nhãn vở.", difficulty:"Vừa sức" },
  { id:"q-g2-6", grade:2, strand:"GEOMETRY", lessonId:"g2-measure", prompt:"Một sợi dây dài 45 cm, cắt đi 18 cm. Dây còn lại dài bao nhiêu?", choices:["27 cm","33 cm","63 cm","23 cm"], answer:"27 cm", hint:"Lấy độ dài ban đầu trừ phần đã cắt.", explanation:"45 − 18 = 27 cm.", difficulty:"Thử thách" },
  { id:"q-g3-3", grade:3, strand:"NUMBER", lessonId:"g3-multiply", prompt:"6 × 4 = ?", choices:["10","20","24","26"], answer:"24", hint:"Có thể tính 6 + 6 + 6 + 6.", explanation:"6 × 4 = 24.", difficulty:"Dễ" },
  { id:"q-g3-4", grade:3, strand:"NUMBER", lessonId:"g3-multiply", prompt:"35 : 5 = ?", choices:["5","6","7","8"], answer:"7", hint:"Tìm số nhân với 5 được 35.", explanation:"5 × 7 = 35 nên 35 : 5 = 7.", difficulty:"Vừa sức" },
  { id:"q-g3-5", grade:3, strand:"GEOMETRY", lessonId:"g3-area", prompt:"Hình chữ nhật có 4 hàng, mỗi hàng 6 ô vuông đơn vị. Diện tích là bao nhiêu ô vuông đơn vị?", choices:["10","20","24","28"], answer:"24", hint:"Số ô bằng số hàng nhân số ô trong mỗi hàng.", explanation:"4 × 6 = 24 ô vuông đơn vị.", difficulty:"Vừa sức" },
  { id:"q-g3-6", grade:3, strand:"NUMBER", lessonId:"g3-multiply", prompt:"Có 7 hộp, mỗi hộp 8 bút chì. Có tất cả bao nhiêu bút chì?", choices:["54","56","64","15"], answer:"56", hint:"Tính 7 × 8.", explanation:"7 × 8 = 56 bút chì.", difficulty:"Thử thách" },
  { id:"q-g4-3", grade:4, strand:"NUMBER", lessonId:"g4-fraction", prompt:"Phân số nào lớn hơn: 3/8 hay 5/8?", choices:["3/8","5/8","Bằng nhau","Không thể so sánh"], answer:"5/8", hint:"Hai phân số cùng mẫu số thì so sánh tử số.", explanation:"Vì 5 > 3 nên 5/8 > 3/8.", difficulty:"Dễ" },
  { id:"q-g4-4", grade:4, strand:"NUMBER", lessonId:"g4-fraction", prompt:"1/4 + 2/4 = ?", choices:["3/4","3/8","2/4","1/2"], answer:"3/4", hint:"Hai phân số cùng mẫu số: cộng các tử số, giữ nguyên mẫu số.", explanation:"1/4 + 2/4 = 3/4.", difficulty:"Vừa sức" },
  { id:"q-g4-5", grade:4, strand:"GEOMETRY", lessonId:"g3-area", prompt:"Hình chữ nhật dài 9 cm, rộng 4 cm. Chu vi bằng bao nhiêu?", choices:["13 cm","26 cm","36 cm","18 cm"], answer:"26 cm", hint:"Chu vi hình chữ nhật bằng tổng chiều dài và chiều rộng nhân 2.", explanation:"(9 + 4) × 2 = 26 cm.", difficulty:"Vừa sức" },
  { id:"q-g4-6", grade:4, strand:"NUMBER", lessonId:"g4-fraction", prompt:"Rút gọn phân số 6/8 được phân số nào?", choices:["3/4","2/3","6/4","1/4"], answer:"3/4", hint:"Chia cả tử số và mẫu số cho 2.", explanation:"6/8 = (6 : 2)/(8 : 2) = 3/4.", difficulty:"Thử thách" },
  { id:"q-g5-3", grade:5, strand:"NUMBER", lessonId:"g5-decimal", prompt:"2,4 + 1,3 = ?", choices:["3,7","3,17","4,7","2,7"], answer:"3,7", hint:"Đặt các chữ số cùng hàng thẳng cột.", explanation:"2,4 + 1,3 = 3,7.", difficulty:"Dễ" },
  { id:"q-g5-4", grade:5, strand:"NUMBER", lessonId:"g5-decimal", prompt:"3,6 × 10 = ?", choices:["0,36","3,60","36","360"], answer:"36", hint:"Nhân số thập phân với 10, dấu phẩy dịch sang phải một chữ số.", explanation:"3,6 × 10 = 36.", difficulty:"Vừa sức" },
  { id:"q-g5-5", grade:5, strand:"NUMBER", lessonId:"g5-percent", prompt:"25% của 80 là bao nhiêu?", choices:["10","15","20","25"], answer:"20", hint:"25% bằng 1/4. Hãy tìm 1/4 của 80.", explanation:"80 : 4 = 20 nên 25% của 80 là 20.", difficulty:"Vừa sức" },
  { id:"q-g5-6", grade:5, strand:"GEOMETRY", lessonId:"g5-volume", prompt:"Khối hộp chữ nhật dài 4 cm, rộng 3 cm, cao 2 cm. Thể tích là bao nhiêu?", choices:["9 cm³","12 cm³","24 cm³","24 cm²"], answer:"24 cm³", hint:"Thể tích khối hộp chữ nhật bằng dài × rộng × cao.", explanation:"4 × 3 × 2 = 24 cm³.", difficulty:"Thử thách" },
];
