import {
	Controller,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
@Controller('plugin')
export class PluginController {
	@Post('upload')
	@UseInterceptors(
		FileInterceptor('file', {
			storage: diskStorage({
				destination: 'uploads',
				filename: (_, file, cb) => {
					const randomName = Array(16)
						.fill(null)
						.map(() => Math.round(Math.random() * 8).toString(8))
						.join('');
					return cb(null, `${randomName}-${file.originalname}`); // 保持原始扩展名
				},
			}),
		}),
	)
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		const imageBuffer = fs.readFileSync(file.path); // 将上传的图片转换成 base64 编码
		const imageBase64 = imageBuffer.toString('base64');
		const mimetype = file.mimetype;
		fs.unlinkSync(file.path); // 清除保存的图片（如果不再需要）
		return 'data:' + mimetype + ';base64,' + imageBase64;
	}
}
