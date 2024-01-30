from kybra import Record, Vec, query, update, void
import qrcode
import io

class QR(Record):
    id: str
    data: str

class Block(Record):
    id: str
    qr_code: "QR"
    productName: str
    hashes: str
    previous_hash: str
    nonce: int
    timestamp: str

genisis: Block = Block(0, "0", "0", "0", "0")
chain: Vec[Block] = [genisis]

@query
def get_chain() -> str:
    return chain

@update
def add_block(block: Block) -> void:
    global chain
    chain = chain + [block]

@update
def make(productName: str, productAmount: int, location: str) -> Vec[Block]:
    for i in range(productAmount):
        block = Block(i, "0", productName, "0", "0", 0, "0")
        add_block(block)
    
    chain_data = []
    for block in get_chain()[len(get_chain())-productAmount:]:
        chain_data.append({
            "block": block.id,
            "productName": block.productName,
            "productId": block.qr_code.id,
            "hashes": block.hashes,
            "previous_hash": block.previous_hash,
            "qrcode": block.qr_code.data
        })
    return chain_data

@update
def scan(data: str) -> bool:
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    img = qr.make_image(fill_color="black", back_color="white")
    qr_byte_io = io.BytesIO()
    img.save(qr_byte_io)
    qr_byte_data = str(qr_byte_io.getvalue())
    for block in get_chain():
        if str(block.qr_code.data) == qr_byte_data:
            return True
    return False