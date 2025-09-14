# Web-H2NQ
bản miễn phí có: 256k bộ nhớ
- mỗi tin nhắn (tối đa 1500 chữ): chiếm tự động điểm bộ nhớ
-> Bản pro sẽ có 3 add context token: chị Nguyen  Reset mỗi tháng
-> Bản thường sẽ có 10 add context token: anh Le  Reset mỗi tháng
- mỗi hình ảnh (tối đa 20MB): chiếm tự động điểm bộ nhớ
- mỗi file (tối đa 50MB): chiếm tự động điểm bộ nhớ

context window sẽ được reset mỗi tuần (bth):
- loại bỏ tin nhắn ko quan trọng và hình ảnh với file được lưu trữ riêng
- compress tin nhắn
- hình ảnh và file được lưu vào database 4gb



bản pro (đóng tiền) có: 1m bộ nhớ

- mỗi tin nhắn (tối đa 2500 chữ): chiếm tự động điểm bộ nhớ
-> Bản pro sẽ có 10 add context token: chị Nguyen  Reset mỗi tháng
-> Bản thường sẽ có 20 add context token: anh Le  Reset mỗi tháng
- mỗi hình ảnh (tối đa 50MB): chiếm tự động điểm bộ nhớ
- mỗi file (tối đa 100MB): chiếm tự động điểm bộ nhớ

context window sẽ được reset mỗi ngày (pro):
- loại bỏ tin nhắn ko quan trọng và hình ảnh với file được lưu trữ riêng
- compress tin nhắn
- hình ảnh và file được lưu vào database 10gb

UI:
- Bản free: chọn sáng tối và thêm 1 màu đặc biệt(bth)
- Bản pro: chọn sáng tối và nhiều màu đặc biệt(gradient, etc)